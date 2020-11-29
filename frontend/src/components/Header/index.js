import React, { Component } from 'react';
import { FaEllipsisV, FaTachometerAlt, FaUserCircle, FaPowerOff, FaListUl } from "react-icons/fa";
import "../../styles/Header/style.css";
import $ from "jquery";

class Header extends Component  {
    constructor(props) {
        super(props);
        this.state = {
            stateToggle: JSON.parse(localStorage.stateToggle).state
        }
    }

    handlerChangePage = (path) => {
        if (path == "/") localStorage.user = '';
        window.location.href = path;
    }

    componentDidMount = async () => {
        let stateToggleHover = false;
        if(this.state.stateToggle == false) {
            $("div.header").toggleClass("active");
            $("div.sidebar").toggleClass("active");
            $("div.container").toggleClass("active");
            $("div.sidebar-header").toggleClass("active");
            $("div.sidebar-menu").toggleClass("active");
            let time = 0;
            if($("div.sidebar").width() == 70) time = 150;
            setTimeout(() => {
                $(".sidebar-header-label").toggleClass("active");
                $(".sidebar-menu-label").toggleClass("active");
                $(".sidebar-menu .dropdown").toggleClass("active");
            }, time);
        }
        $(document).ready(() => {
            $("div.header-toggle").click(() => {
                $("div.header").toggleClass("active");
                $("div.sidebar").toggleClass("active");
                $("div.container").toggleClass("active");
                $("div.sidebar-header").toggleClass("active");
                $("div.sidebar-menu").toggleClass("active");
                localStorage.stateToggle = JSON.stringify({state: !this.state.stateToggle});
                this.setState({stateToggle:!this.state.stateToggle});
                let time = 0;
                if($("div.sidebar").width() == 70) time = 150;
                setTimeout(() => {
                    $(".sidebar-header-label").toggleClass("active");
                    $(".sidebar-menu-label").toggleClass("active");
                    $(".sidebar-menu .dropdown").toggleClass("active");
                }, time);
            })

            $(".header-box").hover(() => {
                $(".header-profile").css("color", "#FFFFFF");
                $(".header-box").css("width", "180px");
                $(".header-box").css("height", "150px");
                $(".header-box").css("opacity", "1");
            },() => {
                $(".header-profile").css("color", "#303030");
                $(".header-box").css("width", "50px");
                $(".header-box").css("height", "50px");
                $(".header-box").css("opacity", "0");
            });

            $(".header-profile").hover(() => {
                $(".header-profile").css("color", "#FFFFFF");
                $(".header-box").css("width", "180px");
                $(".header-box").css("height", "150px");
                $(".header-box").css("opacity", "1");
            },() => {
                $(".header-profile").css("color", "#303030");
                $(".header-box").css("width", "50px");
                $(".header-box").css("height", "50px");
                $(".header-box").css("opacity", "0");
            });

            $("div.sidebar").hover(() => {
                if($("div.sidebar").width() == 60){
                    $("div.header").toggleClass("active");
                    $("div.sidebar").toggleClass("active");
                    $("div.container").toggleClass("active");
                    $("div.sidebar-header").toggleClass("active");
                    $("div.sidebar-menu").toggleClass("active");
                    localStorage.stateToggle = JSON.stringify({state: !this.state.stateToggle});
                    this.setState({stateToggle:!this.state.stateToggle});
                    setTimeout(() => {
                        $(".sidebar-header-label").toggleClass("active");
                        $(".sidebar-menu-label").toggleClass("active");
                        $(".sidebar-menu .dropdown").toggleClass("active");
                    }, 150);
                    stateToggleHover = true;
                }
            },() => {
                if($("div.sidebar").width() == 250 && stateToggleHover == true){
                    $("div.header").toggleClass("active");
                    $("div.sidebar").toggleClass("active");
                    $("div.container").toggleClass("active");
                    $("div.sidebar-header").toggleClass("active");
                    $("div.sidebar-menu").toggleClass("active");
                    $(".sidebar-header-label").toggleClass("active");
                    $(".sidebar-menu-label").toggleClass("active");
                    $(".sidebar-menu .dropdown").toggleClass("active");
                    localStorage.stateToggle = JSON.stringify({state: !this.state.stateToggle});
                    this.setState({stateToggle:!this.state.stateToggle});
                    stateToggleHover = false;
                }
            })
        });
    };
    render () {
        return (
            <div class="header">
                <div class="header-toggle">
                    {(this.state.stateToggle)?<FaEllipsisV size={20}/>:<FaListUl size={20}/>}
                </div>
                <span class="header-name">{this.props.txtHead}</span>
                {this.props.icoHead}
                <FaUserCircle class="header-profile"/>
                <div class="header-box">
                    <ul>
                        <li>
                            <a onClick={()=>this.handlerChangePage("/profile")}>
                                <FaUserCircle class="icon"/>
                                <span>Profile</span>
                            </a>
                        </li>
                        <li>
                            <a id="home-page" onClick={()=>this.handlerChangePage("/")}>
                                <FaPowerOff class="icon"/>
                                <span>Logout</span>
                            </a>
                        </li>
                    </ul>
                </div>
            </div>
        );
    }
}
export default Header;