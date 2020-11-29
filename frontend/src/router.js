import React from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";

import Home from "./containers/Home";
import Dashboard from "./containers/Dashboard";
import Profile from "./containers/Profile";
import Income from "./containers/Income";
import ExpenseExcel from "./containers/ExpenseExcel";
import ExpenseList from "./containers/ExpenseList";
import TransactionsExpense from "./containers/TransactionsExpense";
import TransactionsIncome from "./containers/TransactionsIncome";

const routes = [
  {
    path: "/",
    exact: true,
    component: Home,
  },
  {
    path: "/home",
    component: Home,
  },
  {
    path: "/dashboard",
    component: Dashboard,
  },
  {
    path: "/profile",
    component: Profile,
  },
  {
    path: "/income",
    component: Income,
  },
  {
    path: "/expenseExcel",
    component: ExpenseExcel,
  },
  {
    path: "/expenseList",
    component: ExpenseList,
  },
  {
    path: "/transactionsExpense",
    component: TransactionsExpense,
  },
  {
    path: "/transactionsIncome",
    component: TransactionsIncome,
  }
];

const AppRouter = (props) => {
  return (
    <Router>
      <Switch>
        {routes.map((route, i) =>
            <Route key={i} {...route} path={`${route.path}`} {...props} />
        )}
      </Switch>
    </Router>
  );
};
export default AppRouter;