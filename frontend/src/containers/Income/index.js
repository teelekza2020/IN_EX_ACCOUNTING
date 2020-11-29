import React, { useEffect, useState } from 'react';
import { FaCaretDown, FaFileInvoiceDollar } from 'react-icons/fa';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/Income/style.css";
import $ from "jquery";

const Income = (props) => {
    const [selectedV, setSelectedV] = useState("");

    useEffect(async () => {
        const selected = document.querySelector(".income-form-selected");
        setSelectedV(selected.innerHTML);
        const optionsContain = document.querySelector(".income-form-selectbox-options");
        const optionsList = document.querySelectorAll(".income-form-selectbox-options-option");

        const dropdown = document.getElementById("dropdown");

        selected.addEventListener("click", () => {
            $(selected).toggleClass("active");
            $(dropdown).toggleClass("active");
            optionsContain.classList.toggle("active");
        });

        optionsList.forEach(o => {
            o.addEventListener("click", () => {
                selected.innerHTML = o.querySelector("label").innerHTML;
                setSelectedV(selected.innerHTML);
                $(selected).toggleClass("active");
                $(dropdown).toggleClass("active");
                optionsContain.classList.remove("active");
            });
        });

    }, []);

    const onPressSave = async () => {
        const datetime = document.getElementById("datetime").value;
        const amount = document.getElementById("amount").value;
        if (datetime != "" && amount != "" && selectedV != "Select Category") {
            if (isNaN(Number(amount)) == false) {
                const income = {
                    dateTime: datetime,
                    category: selectedV,
                    amount: Number(amount)
                }
                const user = localStorage.user;
                const response = await fetch(`http://127.0.0.1:3001/income`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({user, income})
                });
                if (response.ok) {
                    const { status , message } = await response.json();
                    alert(message);
                    if (status) {
                    
                    }
                }
            }
            else alert("Amount must be numbers only");
        }
        else alert("Please fill out space field.");
    }
    
    return (
        <div class="ctn-i">
            <Header txtHead={"Income"} icoHead={<FaFileInvoiceDollar class="header-icon"/>}/>
            <Sidebar/>
            <div class="container">
                <div class="income">
                    <div class="income-form">
                        <h1 class="income-form-h1">Date :</h1>
                        <input type="datetime-local" class="income-form-picker" id="datetime" name="datetime"/>
                        <div class="income-form-selectbox">
                            <div class="income-form-selected">
                                Select Category
                            </div>
                            <FaCaretDown class="dropdown" id="dropdown"/>
                            <div class="income-form-selectbox-options">
                                <div class="income-form-selectbox-options-option">
                                    <input type="radio" class="radio" id="renevue" name="category"/>
                                    <label for="renevue">Renevue</label>
                                </div>
                                <div class="income-form-selectbox-options-option">
                                    <input type="radio" class="radio" id="borrow" name="category"/>
                                    <label for="borrow">Borrow</label>
                                </div>
                                <div class="income-form-selectbox-options-option">
                                    <input type="radio" class="radio" id="other" name="category"/>
                                    <label for="other">Other</label>
                                </div>
                            </div>
                        </div>
                        <h1 class="income-form-h1">Amount :</h1>
                        <div class="income-form-textbox">
                            <input type="input" class="income-form-textbox-field" placeholder="Amount" name="amount" id="amount" required/>
                            <label for="amount" class="income-form-textbox-label">Amount</label>
                        </div>
                        <h1 class="income-form-h1">THB</h1>
                        <div class="income-form-btn" onClick={() => onPressSave()}>
                            SAVE
                        </div>
                    </div>
                </div>
            </div>            
        </div>
    );
}
export default Income;