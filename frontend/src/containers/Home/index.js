import React, { useEffect, useState } from 'react';
import { FaAngleDoubleUp } from "react-icons/fa";
import LogoIcon from "../../asset/images/LogoIcon.png";
import Logo from "../../asset/images/Logo.png";
import SignIn from "../../asset/images/SignIn.png";
import SignUp from "../../asset/images/SignUp.png";
import HeaderRegister from "../../asset/images/HeaderRegister.png";
import "../../styles/Home/style.css";
import "../../styles/Login/style.css";
import "../../styles/Register/style.css";

import HomeImage from "../../asset/images/home.png";
import IncomeImage from "../../asset/images/income.png";
import ExpenseImage from "../../asset/images/expense.png";
import TransactionsImage from "../../asset/images/transaction.png";

const Home = props => {
    const [isChecked, setChecked] = useState(false); 

    useEffect(() => {
        if (localStorage.username != undefined && localStorage.password != undefined && localStorage.checkbox != undefined &&
            localStorage.username != null && localStorage.password != null && localStorage.checkbox != null &&
            localStorage.username != "" && localStorage.password != "" && localStorage.checkbox != "") {
            const username = document.getElementsByClassName("f-txtbox-fld")[0];
            const password = document.getElementsByClassName("f-txtbox-fld")[1];
            username.value = localStorage.username;
            password.value = localStorage.password;
            setChecked(true);
        }
        let textBox = document.getElementsByClassName("f-txtbox");
        let marGin = 13.35;
        if (textBox.length-2 > 5) {
            let img = document.getElementsByClassName("register-f-imgbox-img");
            img[0].style.marginTop = String(marGin*(textBox.length-7)+10) + "vh";
        }
    }, []);
    
    const timeAnimation = 2000; // ms

    const header = document.getElementsByClassName("home-hd");
    const headerL = document.getElementsByClassName("home-hd-l");
    const headerR = document.getElementsByClassName("home-hd-r");
    const login = document.getElementsByClassName("login");
    const register = document.getElementsByClassName("register");
    const backArrow = document.getElementsByClassName("back-arrow");
    const modal = document.getElementsByClassName("modal");
    const modalF = document.getElementsByClassName("modal-f");

    const startModal = () => {
        header[0].style.transition = String(timeAnimation/1500)+"s";
        login[0].style.transition = String(timeAnimation/1000)+"s";
        register[0].style.transition = String(timeAnimation/1000)+"s";
        backArrow[0].style.transition = String(timeAnimation/1000)+"s";
    }
    const endModal = () => {
        setTimeout(()=>{
            header[0].style.transition = "0s";
            login[0].style.transition = "0s";
            register[0].style.transition = "0s";
            backArrow[0].style.transition = "0.2s";
        }, timeAnimation);
    }

    const openModalSignIn = () => {
        startModal();
        header[0].style.height = "100vh";
        headerL[0].style.visibility = "hidden";
        headerR[0].style.visibility = "hidden";
        login[0].className = "login active";
        register[0].className = "register";
        backArrow[0].className = "back-arrow active";
        endModal();
    }

    const openModalSignUp = () => {
        startModal();
        header[0].style.height = "100vh";
        headerL[0].style.visibility = "hidden";
        headerR[0].style.visibility = "hidden";
        login[0].className = "login";
        register[0].className = "register active";
        backArrow[0].className = "back-arrow active";
        endModal();
    }

    const closeModal = () => {
        startModal();
        header[0].style.height = "70px";
        headerL[0].style.visibility = "visible";
        headerR[0].style.visibility = "visible";
        login[0].className = "login";
        register[0].className = "register";
        backArrow[0].className = "back-arrow";
        endModal();
    }

    const openModalForgotPass = () => {
        modal[0].className = "modal active";
        modalF[0].className = "modal-f active";
    }
    const closeModalForgotPass = () => {
        modal[0].className = "modal";
        modalF[0].className = "modal-f";
    }
    
    const handlerForgotPassword = async () => {
        const email = document.getElementsByClassName("f-txtbox-fld")[9];

        if (email.checkValidity()) {
            const modalBTN = document.getElementsByClassName("modal-f-btn")[0];
            modalBTN.type = "button";
            const response = await fetch(`http://127.0.0.1:3001/forgotPass`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({email: email.value})
            });
            if (response.ok) {
                const { status , message } = await response.json();
                alert(message);
                if (status) {
                    
                }
                else modalBTN.type = "submit";
            }
            else modalBTN.type = "submit";
        }
    }

    const handlerSignIn = async () => {
        const username = document.getElementsByClassName("f-txtbox-fld")[0];
        const password = document.getElementsByClassName("f-txtbox-fld")[1];
       
        if (username.checkValidity() && password.checkValidity()) {
            const loginBTN = document.getElementsByClassName("login-f-btn")[0];
            loginBTN.type = "button";
            const account = {
                userName: username.value,
                password: password.value,
            }
            const response = await fetch(`http://127.0.0.1:3001/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({account})
            });
            if (response.ok) {
                const { status , message } = await response.json();
                if (status) {
                    if (isChecked) {
                        localStorage.username = username.value;
                        localStorage.password = password.value;
                        localStorage.checkbox = isChecked;
                    }
                    else {
                        localStorage.username = "";
                        localStorage.password = "";
                        localStorage.checkbox = isChecked;
                    }
                    localStorage.user = username.value;
                    localStorage.stateToggle = JSON.stringify({state: true});
                    window.location.href = "/dashboard";
                }
                else {alert(message); loginBTN.type = "submit";}
            }
            else loginBTN.type = "submit";
        }
    }

    const handlerSignUp = async () => {
        const firstname = document.getElementsByClassName("f-txtbox-fld")[2];
        const lastname = document.getElementsByClassName("f-txtbox-fld")[3];
        const username = document.getElementsByClassName("f-txtbox-fld")[4];
        const email = document.getElementsByClassName("f-txtbox-fld")[5];
        const password = document.getElementsByClassName("f-txtbox-fld")[6];
        const confirmPassword = document.getElementsByClassName("f-txtbox-fld")[7];
        const phoneNumber = document.getElementsByClassName("f-txtbox-fld")[8];

        if (firstname.checkValidity() && lastname.checkValidity() && username.checkValidity() && email.checkValidity() && 
            password.checkValidity() && confirmPassword.checkValidity() && phoneNumber.checkValidity()) {
            const regisBTN = document.getElementsByClassName("register-f-btn")[0];
            regisBTN.type = "button";
            if (password.value == confirmPassword.value) {
                const account = {
                    firstName: firstname.value,
                    lastName: lastname.value,
                    userName: username.value,
                    email: email.value,
                    password: password.value,
                    phoneNumber: phoneNumber.value
                }
                const response = await fetch(`http://127.0.0.1:3001/register`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({account})
                });
                if (response.ok) {
                    const { status , message } = await response.json();
                    alert(message);
                    if (status) {
                        firstname.value = "";
                        lastname.value = "";
                        username.value = "";
                        email.value = "";
                        password.value = "";
                        confirmPassword.value = "";
                        phoneNumber.value = "";
                        closeModal();
                    }
                    else regisBTN.type = "submit";
                }
                else regisBTN.type = "submit";
            }
            else {
                alert("Password and ConfirmPassword don't match.");
                confirmPassword.value = "";
                regisBTN.type = "submit";
            }
        }
    }

    return (
        <div class="ctn-h">
            {/*================================================ arrow back ================================================*/}
            <div class="back-arrow" onClick={()=>closeModal()}>
                <FaAngleDoubleUp class="back-arrow-i"/>
            </div>
            {/*================================================ home ================================================*/}
            <div class="home">
                <div class="home-hd">
                    <div class="home-hd-l" onClick={()=>window.location.href="/home"}>
                        <img src={LogoIcon}/>
                        IN-EX Accounting
                    </div>
                    <div class="home-hd-r">
                        <div class="home-hd-r-btn" onClick={()=>openModalSignIn()}>
                            <img src={SignIn}/>
                            SIGN IN
                        </div>
                        <div class="home-hd-r-btn" onClick={()=>openModalSignUp()}>
                            <img src={SignUp}/>
                            SIGN UP
                        </div>
                    </div>
                </div>
                <div class="home-ct">
                    <div class="home-ct-sli">
                        <img src={HomeImage}/>
                        <img src={IncomeImage}/>
                        <img src={ExpenseImage}/>
                        <img src={TransactionsImage}/>
                    </div>
                    <div class="home-ct-btn" onClick={()=>openModalSignIn()}>
                        GET START
                    </div>
                </div>
            </div>
            {/*================================================ login form ================================================*/}
            <div class="login">
                <div class="login-f">
                    <img src={Logo}/>
                    <form class="f-form">
                        <div>
                            <div class="f-txtbox">
                                <input type="input" class="f-txtbox-fld" placeholder="Username" name="username" id="username" maxlength="15" pattern="[a-zA-Z0-9]{6,}" required/>
                                <label for="username" class="f-txtbox-lb">Username</label>
                            </div>
                        </div>
                        <div>
                            <div class="f-txtbox">
                                <input type="password" class="f-txtbox-fld" placeholder="Password" name="password" id="password" maxlength="15" pattern=".{8,}" required/>
                                <label for="password" class="f-txtbox-lb">Password</label>
                            </div>
                        </div>
                        <div class="login-f-ch">
                            <div class="login-f-ch-remb">
                                <input type="checkbox" id="remember_me" name="remember_me" value="remember_me" checked={isChecked} onChange={() => setChecked(!isChecked)}/>
                                <label for="remember_me">Remember Me ?</label>
                            </div>
                            <div class="login-f-ch-forg" onClick={() => openModalForgotPass()}>
                                Forgot Password ?
                            </div>
                        </div>
                        <button type="submit" class="login-f-btn" onClick={handlerSignIn}>
                            LOG IN
                        </button>
                    </form>
                    <div class="f-txt">
                        <h2 class="f-txt-lb">If you don’t have an account, You can sign up</h2>
                        <h2 class="f-txt-btn" onClick={()=>openModalSignUp()}>here</h2>
                    </div>
                </div>
            </div>
            {/*================================================ register form ================================================*/}
            <div class="register">
                <div class="register-f">
                    <div class="register-f-imgbox">
                        <img class="register-f-imgbox-img" src={HeaderRegister}/>
                    </div>
                    <form class="f-form">
                        <div>
                            <div class="f-txtbox">
                                <input type="input" class="f-txtbox-fld" placeholder="Firstname" name="firstname" id="firstname" maxlength="10" pattern="([a-zA-Z]){2,}" required/>
                                <label for="firstname" class="f-txtbox-lb">Firstname</label>
                            </div>
                        </div>
                        <div>
                            <div class="f-txtbox">
                                <input type="input" class="f-txtbox-fld" placeholder="Lastname" name="lastname" id="lastname" maxlength="16" pattern="([a-zA-Z]){2,}" required/>
                                <label for="lastname" class="f-txtbox-lb">Lastname</label>
                            </div>
                        </div>
                        <div>
                            <div class="f-txtbox">
                                <input type="input" class="f-txtbox-fld" placeholder="Username" name="username" id="username" maxlength="15" pattern="[a-zA-Z0-9]{6,}" required/>
                                <label for="username" class="f-txtbox-lb">Username</label>
                            </div>
                        </div>
                        <div>
                            <div class="f-txtbox">
                                <input type="email" class="f-txtbox-fld" placeholder="Email" name="email" id="email" maxlength="30" pattern="[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required/>
                                <label for="email" class="f-txtbox-lb">Email</label>
                            </div>
                        </div>
                        <div>
                            <div class="f-txtbox">
                                <input type="password" class="f-txtbox-fld" placeholder="Password" name="password" id="password" maxlength="15" pattern=".{8,}" required/>
                                <label for="password" class="f-txtbox-lb">Password</label>
                            </div>
                        </div>
                        <div>
                            <div class="f-txtbox">
                                <input type="password" class="f-txtbox-fld" placeholder="Confirm Password" name="con_password" id="con_password" maxlength="15" pattern=".{8,}" required/>
                                <label for="con_password" class="f-txtbox-lb">Confirm Password</label>
                            </div>
                        </div>
                        <div>
                            <div class="f-txtbox">
                                <input type="tel" class="f-txtbox-fld" placeholder="Phone Number" name="phone" id="phone" maxlength="10" pattern="[0]{1}[689]{1}[0-9]{8}" required/>
                                <label for="phone" class="f-txtbox-lb">Phone Number</label>
                            </div>
                        </div>
                        <button type="submit" class="register-f-btn" onClick={handlerSignUp}>
                            CREATE ACCOUNT
                        </button>
                    </form>
                    <div class="f-txt">
                        <h2 class="f-txt-lb">If you have an account, You can sign in</h2>
                        <h2 class="f-txt-btn" onClick={()=>openModalSignIn()}>here</h2>
                    </div>
                    <div style={{margin: "10px"}}></div>
                </div>
            </div>
            {/*================================================ forgot password form ================================================*/}
            <div class="modal">
                <div class="modal-h" onClick={() => closeModalForgotPass()}></div>
                <div class="modal-f">
                    <form class="f-form">
                        <div>
                            <div class="f-txtbox">
                                <input type="email" class="f-txtbox-fld" placeholder="Email" name="email" id="email" maxlength="30" pattern="[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required/>
                                <label for="email" class="f-txtbox-lb">Email</label>
                            </div>
                        </div>
                        <button type="submit" class="modal-f-btn" onClick={handlerForgotPassword}>
                            SEND
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Home;