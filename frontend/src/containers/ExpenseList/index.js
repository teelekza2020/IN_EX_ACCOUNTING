import React, { useEffect, useState } from 'react';
import { FaPlusCircle, FaReceipt } from 'react-icons/fa';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/ExpenseList/style.css";

import $ from "jquery";


const ExpenseList = (props) => {
    let columnsList = 2;
    let numList = 2;

    const [defaultMaterial, setDefaultMaterial] = useState({
        material: "",
        quantity: "",
        unitPrice: "",
        totalPrice: 0,
        state: false
    });
    const data = []
    
    useEffect(async () => {
        data.push(defaultMaterial); // 1
        data.push(defaultMaterial); // 2

        const expenseField = document.querySelectorAll(".expense_list-form-lists-list-item-textbox-field");

        expenseField.forEach(o => {
            $(o).change(() => {
                const mode = o.id.substring(0,1);
                if (mode == "m") onChangeMaterial(o);
                else if (mode == "q") onChangeQuantity(o);
                else if (mode == "u") onChangeUnitPrice(o);
            });
        });
    }, []);

    const setAttributes = (el, attrs) => {
        for(let key in attrs){
            el.setAttribute(key, attrs[key]);
        }
    }

    const onPressAddList = async () => {
        let expenseField = document.querySelectorAll(".expense_list-form-lists-list-item-textbox-field");
        expenseField.forEach(o => {
            $(o).off("change");
        });

        const ul = document.getElementsByClassName("expense_list-form-lists-list");
        for(let i=0;i<columnsList;i++){
            let li = document.createElement("li"); li.setAttribute("class", "expense_list-form-lists-list-item");
            let div = [null, null, null, null];
            let input, label, h1, p;
            div[0] = document.createElement("div"); div[0].setAttribute("class", "expense_list-form-lists-list-item-textbox");
            div[1] = document.createElement("div"); div[1].setAttribute("class", "expense_list-form-lists-list-item-textbox");
            div[2] = document.createElement("div"); div[2].setAttribute("class", "expense_list-form-lists-list-item-textbox");
            div[3] = document.createElement("div"); div[3].setAttribute("class", "expense_list-form-lists-list-item-labelbox");

            let mID = "m"+String(numList);
            let qID = "q"+String(numList);
            let uID = "u"+String(numList);
            let tID = "t"+String(numList);
            /* ---------------------------------------------- add input ---------------------------------------------- */
            input = document.createElement("input");
            setAttributes(input, {"type": "input", "class": "expense_list-form-lists-list-item-textbox-field", "placeholder": "Material", "name": mID, "id": mID, "required": ""});
            div[0].appendChild(input);
            input = document.createElement("input");
            setAttributes(input, {"type": "input", "class": "expense_list-form-lists-list-item-textbox-field", "placeholder": "Quantity", "name": qID, "id": qID, "required": ""});
            div[1].appendChild(input);
            input = document.createElement("input");
            setAttributes(input, {"type": "input", "class": "expense_list-form-lists-list-item-textbox-field", "placeholder": "UnitPrice", "name": uID, "id": uID, "required": ""});
            div[2].appendChild(input);

            /* ---------------------------------------------- add label ---------------------------------------------- */
            label = document.createElement("label")
            setAttributes(label, {"for": mID, "class": "expense_list-form-lists-list-item-textbox-label"});
            label.innerHTML = "Material";
            div[0].appendChild(label);
            label = document.createElement("label")
            setAttributes(label, {"for": qID, "class": "expense_list-form-lists-list-item-textbox-label"});
            label.innerHTML = "Quantity";
            div[1].appendChild(label);
            label = document.createElement("label")
            setAttributes(label, {"for": uID, "class": "expense_list-form-lists-list-item-textbox-label"});
            label.innerHTML = "UnitPrice";
            div[2].appendChild(label);

            label = document.createElement("label")
            setAttributes(label, {"class": "expense_list-form-lists-list-item-labelbox-label", "id": tID});
            h1 = document.createElement("h1"); h1.innerHTML = "TotalPrice";
            p = document.createElement("p"); p.innerHTML = "0 THB";
            label.appendChild(h1);
            label.appendChild(p);
            div[3].appendChild(label);
            
            for(let j=0;j<div.length;j++)
                li.appendChild(div[j]);
            ul[i].appendChild(li);
            numList++;
        }
        data.push(defaultMaterial); // 1
        data.push(defaultMaterial); // 2

        expenseField = document.querySelectorAll(".expense_list-form-lists-list-item-textbox-field");
        expenseField.forEach(o => {
            $(o).change(() => {
                const mode = o.id.substring(0,1);
                if (mode == "m") onChangeMaterial(o);
                else if (mode == "q") onChangeQuantity(o);
                else if (mode == "u") onChangeUnitPrice(o);
            });
        });
    }

    const onPressSave = async () => {
        const datetime = document.getElementById("datetime").value;
        if (datetime != "") {
            let check = false;
            for(let i=0;i<data.length;i++)
                if (data[i].state)
                    check = true
            if (check){
                const expense = {
                    dateTime: datetime,
                    materials: data,
                    state: check
                }
                const user = localStorage.user;
                const response = await fetch(`http://127.0.0.1:3001/expense`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({user, expense})
                });
                if (response.ok) {
                    const { status , message } = await response.json();
                    document.getElementsByClassName("statusRPA")[0].innerHTML = "PASS";
                    alert("Create expense success!!");
                    resetValue();
                }
            }
            else alert("Please fill out material field less than one row.");
        }
        else alert("Please fill out datetime field.");
    }

    const resetValue = () => {
        let expenseField = document.querySelectorAll(".expense_list-form-lists-list-item-textbox-field");
        let expenseLabel = document.querySelectorAll(".expense_list-form-lists-list-item-labelbox-label");
        expenseField.forEach(o => {
            o.value = "";
        });
        expenseLabel.forEach(o => {
            o.children[1].innerHTML = "0 THB";
        })
    }

    const checkState = (item) => {
        if (item.material != "" && item.material != undefined && item.material != null && 
            item.quantity != "" && item.quantity != undefined && item.quantity != null && 
            item.unitPrice != "" && item.unitPrice != undefined && item.unitPrice != null && 
            item.totalPrice != "" && item.totalPrice != undefined && item.totalPrice != null) {
                return true;
        }
        else return false;
    }

    const onChangeMaterial = async (e) => {
        let text = e.value;
        const index = e.id.substring(1);

        const items = data;
        const item = {
            material: text,
            quantity: Number(data[index].quantity),
            unitPrice: Number(data[index].unitPrice),
            totalPrice: Number(data[index].totalPrice),
            state: data[index].state
        }
        item.state = checkState(item);
        items[index] = item;
    }

    const onChangeQuantity = async (e) => {
        let text = e.value;
        if(isNaN(Number(text))) text = "";
        (text.length>0)?e.value = Number(text):e.value = text;
        const index = e.id.substring(1);
        const items = data;
        const item = {
            material: data[index].material,
            quantity: Number(text),
            unitPrice: Number(data[index].unitPrice),
            totalPrice: Number(text) * Number(data[index].unitPrice),
            state: data[index].state
        }
        item.state = checkState(item);
        items[index] = item;
        document.getElementById("t"+String(index)).children[1].innerHTML = String(item.totalPrice) + " THB";
    }

    const onChangeUnitPrice = async (e) => {
        let text = e.value;
        if(isNaN(Number(text))) text = "";
        (text.length>0)?e.value = Number(text):e.value = text;
        const index = e.id.substring(1);
        const items = data;
        const item = {
            material: data[index].material,
            quantity: Number(data[index].quantity),
            unitPrice: Number(text),
            totalPrice: Number(text) * Number(data[index].quantity),
            state: data[index].state
        }
        item.state = checkState(item);
        items[index] = item;
        document.getElementById("t"+String(index)).children[1].innerHTML = String(item.totalPrice) + " THB";
    }

    return (
        <div class="ctn-e">
            <Header txtHead={"Expense List"} icoHead={<FaReceipt class="header-icon"/>}/>
            <Sidebar/>
            <div class="container">
                <div class="expense_list">
                    <div class="expense_list-form">
                        <div class="expense_list-form-date">
                            <h1 class="expense_list-form-date-h1">Date :</h1>
                            <input type="datetime-local" class="expense_list-form-date-picker" id="datetime" name="datetime"/>
                        </div>
                        <div class="expense_list-form-lists">
                            <ul class="expense_list-form-lists-list">
                                <li class="expense_list-form-lists-list-item">
                                    <div class="expense_list-form-lists-list-item-textbox">
                                        <input type="input" class="expense_list-form-lists-list-item-textbox-field" placeholder="Material" name="m0" id="m0" required/>
                                        <label for="m0" class="expense_list-form-lists-list-item-textbox-label">Material</label>
                                    </div>
                                    <div class="expense_list-form-lists-list-item-textbox">
                                        <input type="input" class="expense_list-form-lists-list-item-textbox-field" placeholder="Quantity" name="q0" id="q0" maxLength={3} required/>
                                        <label for="q0" class="expense_list-form-lists-list-item-textbox-label">Quantity</label>
                                    </div>
                                    <div class="expense_list-form-lists-list-item-textbox">
                                        <input type="input" class="expense_list-form-lists-list-item-textbox-field" placeholder="UnitPrice" name="u0" id="u0" maxLength={6} required/>
                                        <label for="u0" class="expense_list-form-lists-list-item-textbox-label">UnitPrice</label>
                                    </div>
                                    <div class="expense_list-form-lists-list-item-labelbox">
                                        <label class="expense_list-form-lists-list-item-labelbox-label" id="t0">
                                            <h1>TotalPrice</h1>
                                            <p>0 THB</p>
                                        </label>
                                    </div>
                                </li>
                            </ul>
                            <ul class="expense_list-form-lists-list">
                                <li class="expense_list-form-lists-list-item">
                                    <div class="expense_list-form-lists-list-item-textbox">
                                        <input type="input" class="expense_list-form-lists-list-item-textbox-field" placeholder="Material" name="m1" id="m1" required/>
                                        <label for="m1" class="expense_list-form-lists-list-item-textbox-label">Material</label>
                                    </div>
                                    <div class="expense_list-form-lists-list-item-textbox">
                                        <input type="input" class="expense_list-form-lists-list-item-textbox-field" placeholder="Quantity" name="q1" id="q1" maxLength={3} required/>
                                        <label for="q1" class="expense_list-form-lists-list-item-textbox-label">Quantity</label>
                                    </div>
                                    <div class="expense_list-form-lists-list-item-textbox">
                                        <input type="input" class="expense_list-form-lists-list-item-textbox-field" placeholder="UnitPrice" name="u1" id="u1" maxLength={6} required/>
                                        <label for="u1" class="expense_list-form-lists-list-item-textbox-label">UnitPrice</label>
                                    </div>
                                    <div class="expense_list-form-lists-list-item-labelbox">
                                        <label class="expense_list-form-lists-list-item-labelbox-label" id="t1">
                                            <h1>TotalPrice</h1>
                                            <p>0 THB</p>
                                        </label>
                                    </div>
                                </li>
                            </ul>
                        </div>
                        <div class="expense_list-form-rowBTN">
                            <div class="expense_list-form-rowBTN-btnAdd" onClick={() => onPressAddList()}>
                                <FaPlusCircle class="icon"/>
                                Add List
                            </div>
                            <div class="expense_list-form-rowBTN-btnSave" onClick={() => onPressSave()}>
                                SAVE
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="statusRPA" style={{visibility:"hidden"}}></div>         
        </div>
    );
}
export default ExpenseList;