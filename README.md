# CryptoXchange

CryptoXchange is a real-time cryptocurrency dashboard built with Angular, featuring dynamic and selective data fetching, pagination, sorting, and persistent favorites. It provides comprehensive coin details and pricing history, leveraging optimised WebSockets for live updates.

## Features

### Landing Page
![alt text](https://res.cloudinary.com/devashish/image/upload/v1729441380/CryptoXchange/currency-table_dejd14.png)



- **Real-Time Cryptocurrency Data**: Fetch and display the top 100 cryptocurrencies in a dynamic table.
- **WebSockets for Live Updates**: View real-time updates for the top 10 coins visible in the current viewport.
- **Table Functionalities**:
  - **Pagination**: Navigate through 100 cryptocurrencies paginated to 10 curreny items per page.
  - **Persistent Sorting**: Maintain the sorting order (name, price, market cap, symbol) even after data refresh.
  - **Websockets**: Websockets which selectively fetch updated prices of 10 currency items in view to add interactivity with optimised performance 
  - **Favorites Toggle**: Add/remove cryptocurrencies to favorites, which are persisted across sessions.
  - **Price Change Indication**: Visualize price changes with red/green updates (toast notifications).
  - **Link to Details**: Navigate to the detailed coin information by clicking on a currency.
  - **Mobile Frindly UI**: 
### Details Page

![alt text](https://res.cloudinary.com/devashish/image/upload/v1729441380/CryptoXchange/currency-details_o1jm72.png)

- **Coin Details**: Display key information like market cap, price, and price history.
- **Favorites Toggle**: Add/remove the cryptocurrency to/from favorites on this page.
- **Price History**: Visualize the price trend over the past 30 days.
- **Mobile Frindly UI**: 


### Testing
![alt text](https://res.cloudinary.com/devashish/image/upload/v1729441390/CryptoXchange/tests_esjewg.png)
- **Exhaustive Unit Testing**: Coverage of all major features using **Jest**.

## Getting Started

### Local Development:
 Clone the repository:

```bash
git clone https://github.com/yourusername/crypto-xchange.git
cd crypto-xchange 
```

Install dependencies:

```bash
npm install
```
Run the development server:
```bash
ng serve
```
Open http://localhost:4200/ to view it in the browser.

### To build the project for production:

```bash
ng build
```
The production-ready files will be stored in the dist/ directory.

### To Test the project:
Run unit tests using Jest:
```bash
npm run test
```


For continuous testing while developing:

```bash
npm run test:watch

```
To generate a code coverage report:

```bash
npm run test:coverage


```


