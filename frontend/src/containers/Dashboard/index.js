import React, { useEffect, useState } from 'react';
import { FaCalendarAlt, FaTachometerAlt } from 'react-icons/fa';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/Dashboard/style.css";

import CanvasJSReact from '../../asset/charts/canvasjs.react';
var CanvasJSChart = CanvasJSReact.CanvasJSChart;

const Dashboard = (props) => {
    const [columnChart, setColumnChart] = useState({});
    const [dataTotal, setDataTotal] = useState({});
    const [dataToday, setDataToday] = useState({});
    const [dataMonth, setDataMonth] = useState({});
    const [dayDiff, setDayDiff] = useState(0);
    const monthsEng = ["JAN", "FEB", "MAR", "APR", "MAY", "JUN", "JUL", "AUG", "SEP", "OCT", "NOV", "DEC"];
    const days = ["MON", "TUE", "WED", "THU", "FRI", "SAT", "SUN"];

    useEffect(async () => {
        const user = localStorage.user;
        const response = await fetch(`http://127.0.0.1:3001/dashboard?userName=${user}`, {
            method: 'GET',
        });
        if (response.ok) {
            const { status, message, data } = await response.json();
            console.log(data);
            setDayDiff(data.dayDiff);

            setDataTotal({
                totalQuantity: data.incomeTotal.tx + data.expenseTotal.tx,
                totalAmount: data.incomeTotal.total - data.expenseTotal.total,
                incomeQuantity: data.incomeTotal.tx,
                incomeAmount: data.incomeTotal.total,
                expenseQuantity: data.expenseTotal.tx,
                expenseAmount: data.expenseTotal.total
            });
    
            const date = new Date();
            setDataToday({
                date: date.getDate()+" "+monthsEng[date.getMonth()]+" "+date.getFullYear(),
                totalQuantity: data.incomeDay.tx + data.expenseDay.tx,
                totalAmount: data.incomeDay.total - data.expenseDay.total,
                incomeQuantity: data.incomeDay.tx,
                incomeAmount: data.incomeDay.total,
                expenseQuantity: data.expenseDay.tx,
                expenseAmount: data.expenseDay.total
            });
    
            setDataMonth({
                month: monthsEng[date.getMonth()]+" "+date.getFullYear(),
                totalQuantity: data.incomeMonth.tx + data.expenseMonth.tx,
                totalAmount: data.incomeMonth.total - data.expenseMonth.total,
                incomeQuantity: data.incomeMonth.tx,
                incomeAmount: data.incomeMonth.total,
                expenseQuantity: data.expenseMonth.tx,
                expenseAmount: data.expenseMonth.total
            });
    
            setColumnChart({
                title:{
                    text: "IN-EX ACCOUNTING",
                    fontSize: 20,
                    fontFamily: "Poppins",
                    fontColor: "#303030",
                    fontWeight: "bold",
                },
                animationEnabled: true, 
                animationDuration: 2500,
                axisX:{
                    labelFontFamily: "Poppins",
                    labelFontColor: "#818181",
                    tickColor: "#818181",
                    lineColor: "#818181",
                },
                axisY:{
                    labelFontFamily: "Poppins",
                    labelFontColor: "#818181",
                    tickColor: "#818181",
                    lineColor: "#818181",
                    minimum: 0
                },
                data: [
                    {
                        type: "column",
                        dataPoints: [
                            { label: "Expense", y: data.expenseTotal.total, color: "#EA6253" },
                            { label: "Income", y: data.incomeTotal.total,  color: "#21BE9F"}
                        ]
                    }
                ],
                width: 500,
                height: 250
            });

            createCalendar(data.firstDay.substring(0, data.firstDay.indexOf(" ")).toUpperCase(), data.lastDay.substring(0, data.lastDay.indexOf(" ")).toUpperCase(), data);
        }
    }, []);

    const createCalendar = (firstDay, lastDay, data) => {
        console.log(firstDay, lastDay)
        let num = 1, bcc, span, checkD = 0;
        const bc = document.getElementsByClassName("bigbox-calendar")[0];
        for(let i=0;i<6;i++){
            bcc = document.createElement("div");
            bcc.setAttribute("class", "bigbox-calendar-content");
            for(let j=0;j<7;j++){
                span = document.createElement("span");
                if(i == 0 && j < days.indexOf(firstDay)){
                    span.setAttribute("class", "notDate");
                }
                else if(i == 5 && j > days.indexOf(lastDay)){
                    span.setAttribute("class", "notDate");
                }
                else {
                    span.innerHTML = num;
                    let div = document.createElement("div");
                    if (data.incomeMonth.data[num-1].tx > 0) {
                        let p = document.createElement("p");
                        p.style.color = "#21BE9F"
                        p.innerHTML = "IN : "+data.incomeMonth.data[num-1].total+" THB";
                        div.appendChild(p);
                    }
                    if (data.expenseMonth.data[num-1].tx > 0) {
                        let p = document.createElement("p");
                        p.style.color = "#EA6253"
                        p.innerHTML = "EX : "+data.expenseMonth.data[num-1].total+" THB";
                        div.appendChild(p);
                    }
                    if(div.children.length > 0)
                        span.appendChild(div);
                    num++;
                }
                bcc.appendChild(span);
            }
            bc.appendChild(bcc);
        }
    }

    return (
        <div class="ctn-d">
            <Header txtHead={"Dashboard"} icoHead={<FaTachometerAlt class="header-icon"/>}/>
            <Sidebar/>
            <div class="container">
                <div class="dashboard">
                    <div class="form">
                    <div class="smallrow">
                        <div class="smallbox">
                        <div class="smallbox-row">
                            <div class="smallbox-row-row">
                            <span class="icon">
                                <FaCalendarAlt class="fa-icon" color="#21BE9F"/>
                            </span>
                            <span>
                                <div>
                                    <h1>Total</h1>
                                </div>
                                <div>
                                    <h3>Total {dataTotal.totalQuantity} Tx</h3>
                                </div>
                            </span>
                            </div>
                            <div class="smallbox-row-col">
                            <h2 style={{color: "#818181"}}></h2>
                                <div style={{marginTop: "45px", background: (dataTotal.totalAmount>=0)?"#D1F2EB":"#FADBD8"}}>
                                    <h2 style={{color: (dataTotal.totalAmount>=0)?"#21BE9F":"#EA6253"}}>{dataTotal.totalAmount}</h2>
                                    <p style={{color: (dataTotal.totalAmount>=0)?"#21BE9F":"#EA6253", marginLeft: "5px"}}>THB</p>
                                </div>
                            </div>
                        </div>
                        <div class="smallbox-row">
                            <span>
                            <h1 style={{color: "#21BE9F"}}>Income</h1>
                            <p style={{color: "#7CD9C6"}}>Total {dataTotal.incomeQuantity} Tx</p>
                            </span>
                            <span class="row">
                            <h2 style={{color: "#21BE9F"}}>{dataTotal.incomeAmount}</h2>
                            <p style={{color: "#21BE9F", marginLeft: "5px"}}>THB</p>
                            </span>
                        </div>
                        <div class="smallbox-row">
                            <span>
                            <h1 style={{color: "#EA6253"}}>Expense</h1>
                            <p style={{color: "#F19E95"}}>Total {dataTotal.expenseQuantity} Tx</p>
                            </span>
                            <span class="row">
                            <h2 style={{color: "#EA6253"}}>{dataTotal.expenseAmount}</h2>
                            <p style={{color: "#EA6253", marginLeft: "5px"}}>THB</p>
                            </span>
                        </div>
                        </div>
                        <div class="smallbox graph">
                            <div>
                                <CanvasJSChart options={columnChart}/>
                            </div>
                        </div>
                    </div>
                    <div class="smallrow">
                        <div class="smallbox">
                        <div class="smallbox-row">
                            <div class="smallbox-row-row">
                            <span class="icon">
                                <FaCalendarAlt class="fa-icon" color="#21BE9F"/>
                            </span>
                            <span>
                                <div>
                                    <h1>Today</h1>
                                </div>
                                <div>
                                    <h3>Total {dataToday.totalQuantity} Tx</h3>
                                </div>
                            </span>
                            </div>
                            <div class="smallbox-row-col">
                            <h2 style={{color: "#818181"}}>{dataToday.date}</h2>
                                <div style={{marginTop: "10px", background: (dataToday.totalAmount>=0)?"#D1F2EB":"#FADBD8"}}>
                                    <h2 style={{color: (dataToday.totalAmount>=0)?"#21BE9F":"#EA6253"}}>{dataToday.totalAmount}</h2>
                                    <p style={{color: (dataToday.totalAmount>=0)?"#21BE9F":"#EA6253", marginLeft: "5px"}}>THB</p>
                                </div>
                            </div>
                        </div>
                        <div class="smallbox-row">
                            <span>
                            <h1 style={{color: "#21BE9F"}}>Income</h1>
                            <p style={{color: "#7CD9C6"}}>Total {dataToday.incomeQuantity} Tx</p>
                            </span>
                            <span class="row">
                            <h2 style={{color: "#21BE9F"}}>{dataToday.incomeAmount}</h2>
                            <p style={{color: "#21BE9F", marginLeft: "5px"}}>THB</p>
                            </span>
                        </div>
                        <div class="smallbox-row">
                            <span>
                            <h1 style={{color: "#EA6253"}}>Expense</h1>
                            <p style={{color: "#F19E95"}}>Total {dataToday.expenseQuantity} Tx</p>
                            </span>
                            <span class="row">
                            <h2 style={{color: "#EA6253"}}>{dataToday.expenseAmount}</h2>
                            <p style={{color: "#EA6253", marginLeft: "5px"}}>THB</p>
                            </span>
                        </div>
                        </div>
                        <div class="smallbox">
                        <div class="smallbox-row">
                            <div class="smallbox-row-row">
                            <span class="icon">
                                <FaCalendarAlt class="fa-icon" color="#21BE9F"/>
                            </span>
                            <span>
                                <div>
                                    <h1>Current Month</h1>
                                </div>
                                <div>
                                    <h3>Total {dataMonth.totalQuantity} Tx</h3>
                                </div>
                            </span>
                            </div>
                            <div class="smallbox-row-col">
                            <h2 style={{color: "#818181"}}>{dataMonth.month}</h2>
                                <div style={{marginTop: "10px", background: (dataMonth.totalAmount>=0)?"#D1F2EB":"#FADBD8"}}>
                                    <h2 style={{color: (dataMonth.totalAmount>=0)?"#21BE9F":"#EA6253"}}>{dataMonth.totalAmount}</h2>
                                    <p style={{color: (dataMonth.totalAmount>=0)?"#21BE9F":"#EA6253", marginLeft: "5px"}}>THB</p>
                                </div>
                            </div>
                        </div>
                        <div class="smallbox-row">
                            <span>
                            <h1 style={{color: "#21BE9F"}}>Income</h1>
                            <p style={{color: "#7CD9C6"}}>Total {dataMonth.incomeQuantity} Tx</p>
                            </span>
                            <span class="row">
                            <h2 style={{color: "#21BE9F"}}>{dataMonth.incomeAmount}</h2>
                            <p style={{color: "#21BE9F", marginLeft: "5px"}}>THB</p>
                            </span>
                        </div>
                        <div class="smallbox-row">
                            <span>
                            <h1 style={{color: "#EA6253"}}>Expense</h1>
                            <p style={{color: "#F19E95"}}>Total {dataMonth.expenseQuantity} Tx</p>
                            </span>
                            <span class="row">
                            <h2 style={{color: "#EA6253"}}>{dataMonth.expenseAmount}</h2>
                            <p style={{color: "#EA6253", marginLeft: "5px"}}>THB</p>
                            </span>
                        </div>
                        </div>
                    </div>
                    <div class="bigrow">
                        <div class="bigbox">
                        <div class="bigbox-header">
                            <div>
                            <h1 style={{color: "#303030"}}>{dataMonth.month}</h1>
                            <h2>{dayDiff} days</h2>
                            </div>
                            <div>
                            <h2 style={{color: "#21BE9F"}}>{dataMonth.incomeAmount}<p style={{color: "#21BE9F", paddingLeft: "5px"}}>THB</p></h2>
                            <h2 style={{color: "#EA6253"}}>{dataMonth.expenseAmount}<p style={{color: "#EA6253", paddingLeft: "5px"}}>THB</p></h2>
                            </div>
                        </div>
                        <div class="bigbox-calendar">
                            <div class="bigbox-calendar-head">
                                <span>MON</span>
                                <span>TUE</span>
                                <span>WED</span>
                                <span>THU</span>
                                <span>FRI</span>
                                <span>SAT</span>
                                <span>SUN</span>
                            </div>
                        </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>            
        </div>
    );
}
export default Dashboard;