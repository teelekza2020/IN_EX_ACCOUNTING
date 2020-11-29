import React, { Component } from 'react';
import { FaTachometerAlt, FaUserCircle, FaPowerOff, FaFolderPlus, FaFileExcel, FaReceipt, FaFileInvoiceDollar, FaExchangeAlt, FaCaretDown } from "react-icons/fa";
import LogoIcon from "../../asset/images/LogoIcon.png";
import "../../styles/Sidebar/style.css";
import $ from "jquery";

class Sidebar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            dataProfile: {}
        }
    }

    componentDidMount = async () => {
        const user = localStorage.user;
        const response = await fetch(`http://127.0.0.1:3001/readProfile?userName=${user}`, {
            method: 'GET',
        });
        if (response.ok) {
            const { status, message, data } = await response.json();
            if (status) {
               this.setState({dataProfile: data});
            }
        }

        $(document).ready(() => {
            const btnA = document.getElementsByName("btn-a");
            for(let i=0;i<btnA.length;i++){
                $(btnA[i]).click(() => {
                    $(btnA[i].parentElement.children[1]).toggleClass("showSub");
                    $(btnA[i].children[2]).toggleClass("rotateIcon");
                });
            }

            const name = document.getElementById("name");
            if(name.innerHTML.length-1 > 10)
                name.style.fontSize = String(15 - ((name.innerHTML.length-1 - 10)*0.5)) + "px";
        });
    }

    handlerChangePage = (path) => {
        if (path == "/") localStorage.user = '';
        window.location.href = path;
    }

    render () {
        return (
            <div class="sidebar">
                <div class="sidebar-header">
                    <a onClick={()=>this.handlerChangePage("/dashboard")}>
                        <img class="sidebar-header-img" src={LogoIcon}/>
                        <span class="sidebar-header-label">IN-EX Accounting</span>
                    </a>
                </div>
                <div class="sidebar-menu">
                    <ul>
                        <li class="profile-li">
                            <a id="head-menu" class="profile-a" name="btn-a">
                                <FaUserCircle size={35} color={"#FFFFFF"} class="icon"/>
                                <span class="sidebar-menu-label" id="name">{this.state.dataProfile.firstName} {this.state.dataProfile.lastName}</span>
                                <FaCaretDown class="dropdown"/>
                            </a>
                            <ul>
                                <li>
                                    <a onClick={()=>this.handlerChangePage("/profile")}>
                                        <FaUserCircle size={30} color={"#FFFFFF"}/>
                                        <span class="sidebar-menu-label">Profile</span>
                                    </a>
                                </li>
                                <li>
                                    <a onClick={()=>this.handlerChangePage("/")} id="home-page">
                                        <FaPowerOff size={30} color={"#FFFFFF"}/>
                                        <span class="sidebar-menu-label">Logout</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a onClick={()=>this.handlerChangePage("/dashboard")}>
                                <FaTachometerAlt size={35} color={"#FFFFFF"} class="icon"/>
                                <span class="sidebar-menu-label">Dashboard</span>
                            </a>
                        </li>
                        <li>
                            <a id="head-menu" name="btn-a">
                                <FaFolderPlus size={35} color={"#FFFFFF"} class="icon"/>
                                <span class="sidebar-menu-label">Create TX</span>
                                <FaCaretDown class="dropdown"/>
                            </a>
                            <ul>
                                <li style={{marginRight: "10px"}}>
                                    <a onClick={()=>this.handlerChangePage("/expenseExcel")}>
                                        <FaFileExcel size={30} color={"#FFFFFF"}/>
                                        <span class="sidebar-menu-label">Expense Excel</span>
                                    </a>
                                </li>
                                <li style={{marginRight: "10px"}}>
                                    <a onClick={()=>this.handlerChangePage("/expenseList")}>
                                        <FaReceipt size={30} color={"#FFFFFF"}/>
                                        <span class="sidebar-menu-label">Expense List</span>
                                    </a>
                                </li>
                                <li style={{marginRight: "10px"}}>
                                    <a onClick={()=>this.handlerChangePage("/income")}>
                                        <FaFileInvoiceDollar size={30} color={"#FFFFFF"}/>
                                        <span class="sidebar-menu-label">Income</span>
                                    </a>
                                </li>
                            </ul>
                        </li>
                        <li>
                            <a onClick={()=>this.handlerChangePage("/transactionsExpense")}>
                                <FaExchangeAlt size={35} color={"#FFFFFF"} class="icon"/>
                                <span class="sidebar-menu-label">Transactions</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default Sidebar;