import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { FaExchangeAlt, FaCaretLeft, FaCaretRight, FaCaretDown } from 'react-icons/fa';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/TransactionsIncome/style.css";

const TransactionsIncome = (props) => {
    const monthsEng = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const monthsEngFull = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

    useEffect(async () => {
        const user = localStorage.user;
        const response = await fetch(`http://127.0.0.1:3001/transactions?userName=${user}`, {
            method: 'GET',
        });
        if (response.ok) {
            const { status, message, data } = await response.json();
            console.log(data);
            console.log(typeof(<FaCaretDown/>))
            document.getElementsByClassName("transactions_income-form-header-inBTN")[0].children[1].children[0].innerHTML = data.incomeTotal.total;
            document.getElementsByClassName("transactions_income-form-header-exBTN")[0].children[1].children[0].innerHTML = data.expenseTotal.total;
            createTx(data);
        }
    }, []);

    const createTx = (data) => {
        const ul = document.getElementsByClassName("transactions_income-form-lists")[0];
        for(let i=0;i<data.incomeTotal.tx;i++){
            const li = document.createElement("li");
            li.setAttribute("class", "transactions_income-form-lists-list");

            const div = document.createElement("div");
            div.setAttribute("class", "transactions_income-form-lists-list-item");
            const div2 = document.createElement("div"), div3 = document.createElement("div");
            div2.setAttribute("class", "transactions_income-form-lists-list-item-label");
            div3.setAttribute("class", "transactions_income-form-lists-list-item-label");
            const h2 = document.createElement("h2"), h3 = document.createElement("h3"), p = document.createElement("p");
            let date = new Date(data.incomeTotal.data[i].date).toString();
            let day, month, year;
            month = date.substring(date.indexOf(" ")+1, date.indexOf(" ")+4);
            date = date.substring(date.indexOf(" ")+5);
            day = date.substring(0, date.indexOf(" ")); 
            if(day.length == 1)
                day='0'+day
            date = date.substring(date.indexOf(" ")+1);
            year = date.substring(0, date.indexOf(" "));
            date = date.substring(date.indexOf(" ")+1);
            h2.innerHTML = (day + " " + monthsEngFull[monthsEng.indexOf(month.toUpperCase())] + " " + year).toUpperCase();
            h3.innerHTML = data.incomeTotal.data[i].total; p.innerHTML = "THB";
            div2.appendChild(h2);
            const span = document.createElement("span");
            ReactDOM.render(
                <FaCaretDown />,
                span
            );
            div3.appendChild(h3); div3.appendChild(p); div3.appendChild(span);

            div.appendChild(div2); div.appendChild(div3);

            li.appendChild(div);
            li.appendChild(createTx2(data.incomeTotal.data[i]));

            ul.appendChild(li);
        }
        const dayList = document.querySelectorAll(".transactions_income-form-lists-list");
        dayList.forEach(d => {
            d.children[0].addEventListener("click", () => {
                d.classList.toggle("active");
            });
            const timeList = d.querySelectorAll(".transactions_income-form-lists-list-lists-list");
            timeList.forEach(t => {
                t.children[0].addEventListener("click", () => {
                    t.classList.toggle("active");
                });
            });
        });
    }

    const createTx2 = (data) => {
        const ul = document.createElement("ul");
        ul.setAttribute("class", "transactions_income-form-lists-list-lists");

        for(let i=0;i<data.tx;i++){
            const li = document.createElement("li");
            li.setAttribute("class", "transactions_income-form-lists-list-lists-list");

            const div = document.createElement("div");
            div.setAttribute("class", "transactions_income-form-lists-list-lists-list-item");
            const div2 = document.createElement("div"), div3 = document.createElement("div");
            div2.setAttribute("class", "transactions_income-form-lists-list-lists-list-item-label");
            div3.setAttribute("class", "transactions_income-form-lists-list-lists-list-item-label");
            const h2 = document.createElement("h2"), h3 = document.createElement("h3"), p = document.createElement("p");
            let time = data.data[i].time
            let hour, minute;
            hour = time.substring(0, time.indexOf(":"));
            time = time.substring(time.indexOf(":")+1);
            minute = time.substring(0, time.indexOf(":"));
            if(hour.length == 1)
                hour='0'+hour
            if(minute.length == 1)
                minute='0'+minute
            h2.innerHTML = hour + ":" + minute; h3.innerHTML = data.data[i].total; p.innerHTML = "THB";
            div2.appendChild(h2);
            const span = document.createElement("span");
            ReactDOM.render(
                <FaCaretDown />,
                span
            );
            div3.appendChild(h3); div3.appendChild(p); div3.appendChild(span);

            div.appendChild(div2); div.appendChild(div3);

            const ul2 = document.createElement("ul");
            ul2.setAttribute("class", "transactions_income-form-lists-list-lists-list-lists");
            ul2.appendChild(createTx3(data.data[i]));

            li.appendChild(div);
            li.appendChild(ul2);

            ul.appendChild(li);
        }
        return ul;
    }

    const createTx3 = (data) => {
        const li = document.createElement("li");
        li.setAttribute("class", "transactions_income-form-lists-list-lists-list-lists-list");

        const span = document.createElement("span"), span2 = document.createElement("span");
        span.setAttribute("class", "total");
        span2.innerHTML = "Total : "+data.total+" THB";
        span.appendChild(span2);
        li.appendChild(span);
        for(let i=0;i<data.tx+1;i++){
            const div = document.createElement("div");
            const spans = [null, null, null];
            for(let j=0;j<spans.length;j++)
                spans[j] = document.createElement("span");
            if(i==0) {
                div.setAttribute("class", "head");
                spans[0].innerHTML = "No.";
                spans[1].innerHTML = "Category";
                spans[2].innerHTML = "Amount";
            }
            else {
                spans[0].innerHTML = i;
                spans[1].innerHTML = data.data[i-1].category;
                spans[2].innerHTML = data.data[i-1].amount + " THB";
            }
            for(let j=0;j<spans.length;j++)
                div.appendChild(spans[j]);
            li.appendChild(div);
        }
        return li;
    }

    const handlerChangePage = (path) => {
        window.location.href = path;
    }

    return (
        <div class="ctn-t">
            <Header txtHead={"Transactions"} icoHead={<FaExchangeAlt class="header-icon"/>}/>
            <Sidebar/>
            <div class="container">
                <div class="transactions_income">
                    <div class="transactions_income-form">
                        <div class="transactions_income-form-header">
                            <div class="transactions_income-form-header-inBTN" onClick={() => handlerChangePage("/transactionsIncome")}>
                                <h1>Income</h1>
                                <span>
                                    <h1>22800</h1>
                                    <p>THB</p>
                                </span>
                            </div>
                            <div class="transactions_income-form-header-exBTN" onClick={() => handlerChangePage("/transactionsExpense")}>
                                <h1>Expense</h1>
                                <span>
                                    <h1>1008</h1>
                                    <p>THB</p>
                                </span>
                            </div>
                        </div>
                        <ul class="transactions_income-form-lists">
                        </ul>
                        <div class="transactions_income-form-paginations">
                            {/*<span><FaCaretLeft/></span>
                            <span>1</span>
                            <span>2</span>
                            <span>...</span>
                            <span>6</span>
                            <span><FaCaretRight/></span>*/}
                        </div>
                    </div>
                </div>
            </div>     
        </div>
    );
}
export default TransactionsIncome;