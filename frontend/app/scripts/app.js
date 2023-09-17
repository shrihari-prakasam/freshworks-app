/* Freshdesk interview assignment */

var client;

init();

const NO_AVATAR_IMAGE = "https://upload.wikimedia.org/wikipedia/commons/a/ac/Default_pfp.jpg";
const MONTHS = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

// Somewhere from StackOverflow... To replace variables in the format ${name} with the value of it.
function compileTemplate(str, obj) { return str.replace(/\${(.*?)}/g, (_, g) => obj[g]) };

async function init() {
  client = await app.initialized();
  client.events.on('app.activated', initialize);
}

async function initialize() {
  try {
    renderGreeting();
    renderKYC();
    renderCREDPayConversions();
    renderRatings();
    renderCurrentTickets();
    renderPaymentList();
  } catch (error) {
    console.error(error);
  }
}

async function renderGreeting() {
  const data = await client.data.get("loggedInUser");
  console.log("Logged in user is", data);
  const textElement = document.querySelector('.greeting');
  textElement.innerHTML = `Hello, ${data.loggedInUser.contact.name}!`;
}

async function renderCurrentTickets() {
  // The error from API is very, very generic. I have no idea what's wrong with my query.
  // So I instead just used the usual tickets API and filtered them out myself :(.

  /* const today = new Date();
  today.setDate(new Date().getDate() - 1);
  const result = await client.request.invokeTemplate("filterTickets", {
    context: { query: `created_at:>'${today.toISOString().split('T')[0]}'` }
  });
  const response = JSON.parse(result.response); */

  let today = new Date();
  today.setDate(new Date().getDate());
  today = today.toISOString().split('T')[0];
  const result = await client.request.invokeTemplate("getTickets", {
    context: { page: 1 }
  });
  const response = JSON.parse(result.response);
  // Exclude kyc tickets and filter tickets containing today's date in created_at field.
  const tickets = response.filter(ticket => !ticket.tags.includes('kyc') && ticket.created_at.includes(today));
  const template = document.getElementById("ticket-item-template").innerHTML;
  const ticketContainer = document.querySelector(".ticket-container");
  ticketContainer.innerHTML = `<h2 class="section-heading">Today's Tickets (${tickets.length})</h2>`;
  for (let i = 0; i < tickets.length; i++) {
    // Update UI for each ticket.
    const ticket = tickets[i];
    const compiled = compileTemplate(template, {
      ticketId: ticket.id,
      ticketTitle: ticket.subject,
      ticketType: ticket.type
    });
    ticketContainer.innerHTML += compiled;
  }
}

async function renderKYC() {
  const result = await client.request.invokeTemplate("getTickets", {
    context: { page: 1 }
  });
  const response = JSON.parse(result.response);
  const tickets = response.filter(ticket => ticket.tags.includes('kyc'));
  const template = document.getElementById("kyc-item-template").innerHTML;
  const kycContainer = document.querySelector(".kyc-container");
  const children = [];
  for (let i = 0; i < tickets.length; i++) {
    const kycItem = document.createElement('div');
    kycItem.classList.add("kyc-item-container");
    const ticket = tickets[i];
    const requesterId = ticket.requester_id;
    // Find user associated with each KYC ticket to display their email and phone number.
    const requesterData = await client.request.invokeTemplate("getContact", {
      context: { contact_id: requesterId }
    });
    const user = JSON.parse(requesterData.response);
    user.avatar_url = user.avatar ? user.avatar.avatar_url : NO_AVATAR_IMAGE;
    // I used a HTML templating approach so that the Javascript looks clean. Check the <template> tags in index.html.
    const compiled = compileTemplate(template, {
      ticketId: ticket.id,
      userFullName: user.name,
      avatarUrl: user.avatar_url,
      userEmail: user.email,
      userPhone: user.phone
    });
    kycItem.innerHTML = compiled;
    children.push(kycItem);
  }
  kycContainer.innerHTML = `<h2 class="section-heading">KYCs for today (${tickets.length})</h2>`;
  // It is inefficient to add another loop, yes, but this is only to render all the list elements together in one go.
  // If this loop didn't exist, the list would get populated one by one with a few ms gap,
  // which looks very ugly in my opinion.
  children.forEach((child) => kycContainer.appendChild(child));
}

async function renderCREDPayConversions() {
  const domain = await this.client.iparams.get("backend_domain");
  // Comes from my own node JS backend. The backend has APIs to post sales and get them by month.
  const response = await fetch(`${domain.backend_domain}/sale`);
  const data = await response.json();
  const container = document.querySelector(".stats-container");
  container.innerHTML = document.getElementById("stats-template").innerHTML;
  const ctx = document.getElementById('stats-chart');
  // Convert month from numbers to name.
  const labels = data.map((data) => MONTHS[data._id.month]);
  const count = data.map((data) => data.count);
  // Some chart js stuff...
  new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of conversions',
        data: count,
        borderWidth: 1,
        borderColor: '#3c759e',
        lineTension: 0.2,
        /* pointStyle: false */
      }]
    },
    options: {
      plugins: { legend: { display: false }, },
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          ticks: {
            precision: 0,
          },
          grid: {
            display: false
          },
          border: {
            display: false,
          },
        }
      },
      elements: {
        point: {
          radius: 3
        }
      }
    }
  });
}

async function renderRatings() {
  const domain = await this.client.iparams.get("backend_domain");
  console.log(domain)
  const response = await fetch(`${domain.backend_domain}/rating`);
  const data = await response.json();
  const container = document.querySelector(".ratings-container");
  container.innerHTML = document.getElementById("ratings-template").innerHTML;
  const ctx = document.getElementById('ratings-chart');
  const labels = Object.keys(data).map((d) => d + " ⭐");
  const count = Object.values(data);
  new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [{
        label: 'Number of ratings',
        data: count,
        borderWidth: 1,
        borderColor: '#00000000',
        backgroundColor: '#3c759e',
        lineTension: 0.2,
      }]
    },
    options: {
      plugins: { legend: { display: false }, },
      maintainAspectRatio: false,
      scales: {
        x: {
          grid: {
            display: false,
          },
          border: {
            display: false,
          },
        },
        y: {
          ticks: {
            precision: 0,
          },
          grid: {
            display: false
          },
          border: {
            display: false,
          },
        }
      },
      elements: {
        point: {
          radius: 3
        }
      }
    }
  });
}

async function renderPaymentList() {
  const mockData = [
    {
      "name": "John Doe",
      "amount": "$100",
      "type": "credit",
      "transactionId": "abc-123-def-456",
      "date": "2 hours ago"
    },
    {
      "name": "Joe Goldberg",
      "amount": "$150",
      "type": "credit",
      "transactionId": "abc-123-def-789",
      "date": "6 hours ago"
    },
    {
      "name": "Gloria",
      "amount": "$738",
      "type": "credit",
      "transactionId": "abc-123-def-ghi",
      "date": "yesterday"
    },
  ]
  document.querySelector(".transactions-container").innerHTML =
    `<h2 class="section-heading">Recent Transactions (${mockData.length})</h2>`;
  mockData.forEach((item) => {
    // I used a HTML templating approach so that the Javascript looks clean. Check the <template> tags in index.html.
    const template = document.getElementById("transaction-item-template").innerHTML;
    const compiled = compileTemplate(template, item);
    console.log(document.querySelector(".transactions-container"));
    document.querySelector(".transactions-container").innerHTML += compiled;
  })
}