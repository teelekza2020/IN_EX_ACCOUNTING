import React, { useEffect, useState } from 'react';
import { FaDownload, FaFileExcel } from 'react-icons/fa';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/ExpenseExcel/style.css";

import * as XLSX from "xlsx";

const ExpenseExcel = (props) => {
    const [dataExcel, setDataExcel] = useState([]);

    useEffect(async () => {
        
    }, []);

    const readExcel = (file) => {
        const fileName = document.getElementsByClassName("expense_excel-form-upload-h2")[0];
        fileName.innerHTML = file.name;

        const fileType = file.name.substring(file.name.indexOf('.')+1, file.name.length);
        if (fileType == "xlsx" || fileType == "xls") {
            const reader = new FileReader();
            reader.onload = (evt) => { 
                const bstr = evt.target.result;
                const wb = XLSX.read(bstr, {type:'binary'});
                const wsname = wb.SheetNames[0];
                const ws = wb.Sheets[wsname];
                const data = XLSX.utils.sheet_to_json(ws, {header:2});
                const items = data.map((item) => ({
                    ...item,
                    totalPrice: (isNaN(Number(item.quantity * item.unitPrice)))?0:item.quantity * item.unitPrice,
                    state: checkState(item, (isNaN(Number(item.quantity * item.unitPrice)))?0:item.quantity * item.unitPrice)
                }));
                setDataExcel(items);
            };
            reader.readAsBinaryString(file);
        }
    }

    const onPressSave = async () => {
        const datetime = document.getElementById("datetime").value;
        if (datetime != "" && dataExcel.length > 0) {
            let check = false;
            for(let i=0;i<dataExcel.length;i++)
                if (dataExcel[i].state)
                    check = true
            if (check){
                const expense = {
                    dateTime: datetime,
                    materials: dataExcel,
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
                    alert("Create expense success!!");
                }
            }
            else alert("No data for create.");
        }
        else alert("Please fill out space field.");
    }

    const checkState = (item, totalPrice) => {
        if (item.material != "" && item.material != undefined && item.material != null && 
            item.quantity != "" && item.quantity != undefined && item.quantity != null && 
            item.unitPrice != "" && item.unitPrice != undefined && item.unitPrice != null && 
            totalPrice != "" && totalPrice != undefined && totalPrice != null) {
                return true;
        }
        else return false;
    }

    return (
        <div class="ctn-e">
            <Header txtHead={"Expense Excel"} icoHead={<FaFileExcel class="header-icon"/>}/>
            <Sidebar/>
            <div class="container">
                <div class="expense_excel">
                    <div class="expense_excel-form">
                        <div class="expense_excel-form-date">
                            <h1 class="expense_excel-form-date-h1">Date :</h1>
                            <input type="datetime-local" class="expense_excel-form-date-picker" id="datetime" name="datetime"/>
                        </div>
                        <div class="expense_excel-form-upload">
                            <input type="file" id="expense_excel-form-upload-btnbox" name="file-input" onChange={(e) => readExcel(e.target.files[0])}/>
                            <label for="expense_excel-form-upload-btnbox" class="expense_excel-form-upload-btnbox">
                                <FaDownload class="icon"/>
                                Click to Choose Excel
                            </label>
                            <h2 class="expense_excel-form-upload-h2"></h2>
                        </div>
                        <div class="expense_excel-form-btn" onClick={() => onPressSave()}>
                            SAVE
                        </div>
                    </div>
                </div>
            </div>         
        </div>
    );
}
export default ExpenseExcel;