# freshworks-app

## Running the application:

### Backend:
1. Run `cd backend`.
2. Create a .env file with the following contents:
```
MONGODB_URL=your_mongodb_url
```
3. Run `node index.js`.
4. To create a Sale object, send a request to `POST http://localhost:3000/sale` with the following body:
```json
{
    "customerId": "123456789",
    "customerName": "John Doe",
    "subscriptionPlan": "CRED Pay",
    "saleDate": "2023-04-17T08:21:50.010Z"
}
```
5. Repeat this API several times for different dates.
6. To create a Rating object, send a request to `POST http://localhost:3000/rating` with the following body:
```json
{
    "value": 5
}
```
7. Repeat for different rating values.

> Note: If you do not want to setup your own backend, use http://ec2-43-205-235-209.ap-south-1.compute.amazonaws.com:3000/. This already has the required mock data.

### FrontEnd:
1. Run command `cd frontend`.
2. Run `fdk run`.
3. Go to `http://localhost:10001/custom_configs` and input your parameters. Hit install.
4. Now append `?dev=true` to your Freshworks instance URL and click on the app icon.
5. You should now see the dashboard.