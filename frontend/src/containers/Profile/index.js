import React, { useEffect, useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FiEdit } from 'react-icons/fi';
import Header from "../../components/Header";
import Sidebar from "../../components/Sidebar";
import "../../styles/Profile/style.css";
import $ from "jquery";

const Profile = (props) => {
    const [dataProfile, setDataProfile] = useState({});

    useEffect(async () => {
        const user = localStorage.user;
        const response = await fetch(`http://127.0.0.1:3001/readProfile?userName=${user}`, {
            method: 'GET',
        });
        if (response.ok) {
            const { status, message, data } = await response.json();
            if (status) {
               setDataProfile(data);
            }
        }

    }, []);

    const handleOpenModal = async (type, form, state) => {
        let fsub = (form.indexOf(" ") > -1)?form.substring(0, form.indexOf(" ")).toLowerCase():form.toLowerCase();
        if(state==1){
            $('.modal').css("transition", "0.5s");
            $('.modal').toggleClass("toggle");
            $('.modal-form').toggleClass("toggle");
            document.getElementsByClassName("modal-form-textbox-field")[0].value = $(document.getElementById("f-"+fsub).children)[1].innerHTML;
            document.getElementsByClassName("modal-form-textbox-field")[0].type = type;
            document.getElementsByClassName("modal-form-textbox-field")[0].placeholder = form;
            document.getElementsByClassName("modal-form-textbox-field")[0].name = fsub;
            //document.getElementsByClassName("modal-form-textbox-field")[0].id = fsub;
            document.getElementsByClassName("modal-form-textbox-label")[0].htmlFor = fsub;
            document.getElementsByClassName("modal-form-textbox-label")[0].innerHTML = form;
            if(fsub == "phone"){
                document.getElementsByClassName("modal-form-textbox-field")[0].maxLength = 10;
                document.getElementsByClassName("modal-form-textbox-field")[0].pattern = "[0]{1}[689]{1}[0-9]{8}";
            }
            else if(fsub == "username"){
                document.getElementsByClassName("modal-form-textbox-field")[0].maxLength = 15;
                document.getElementsByClassName("modal-form-textbox-field")[0].pattern = "[a-zA-Z0-9]{6,}";
            }
            else if(fsub == "email"){
                document.getElementsByClassName("modal-form-textbox-field")[0].maxLength = 30;
                document.getElementsByClassName("modal-form-textbox-field")[0].pattern = "[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$";
            }
        }
        else if(state==2){
            $('.modal2').css("transition", "0.5s");
            $('.modal2').toggleClass("toggle");
            $('.modal2-form').toggleClass("toggle");
            document.getElementsByName("old_pass")[0].value = dataProfile.password;
        }
        else if(state==3){
            $('.modal3').css("transition", "0.5s");
            $('.modal3').toggleClass("toggle");
            $('.modal3-form').toggleClass("toggle");
            document.getElementsByName("firstname")[0].value = dataProfile.firstName;
            document.getElementsByName("lastname")[0].value = dataProfile.lastName;
        }
        setTimeout(() => {
            $('.modal').css("transition", "0s");
            $('.modal2').css("transition", "0s");
            $('.modal3').css("transition", "0s");
        }, 500);
    }
    const handleCloseModal = (state) => {
        if(state==1){
            $('.modal').css("transition", "0.5s");
            $('.modal').toggleClass("toggle");
            $('.modal-form').toggleClass("toggle");
        }
        else if(state==2){
            $('.modal2').css("transition", "0.5s");
            $('.modal2').toggleClass("toggle");
            $('.modal2-form').toggleClass("toggle");
        }
        else if(state==3){
            $('.modal3').css("transition", "0.5s");
            $('.modal3').toggleClass("toggle");
            $('.modal3-form').toggleClass("toggle");
        }
        setTimeout(() => {
            $('.modal').css("transition", "0s");
            $('.modal2').css("transition", "0s");
            $('.modal3').css("transition", "0s");
        }, 500); 
    }

    const onPressSave = async (state) => {
        const account = {
            firstName: dataProfile.firstName,
            lastName: dataProfile.lastName,
            email: dataProfile.email,
            userName: dataProfile.userName,
            phoneNumber: dataProfile.phoneNumber,
            password: dataProfile.password,
        };
        if(state == 1) {
            const modal1 = document.getElementById("modal1-txt");
            const btn = document.getElementById("modal1-btn");
            if(modal1.checkValidity()){
                btn.type = "button";
                const currentUpdate = modal1.name;
                if (modal1.name == "email") account.email = modal1.value;
                else if (modal1.name == "username") account.userName = modal1.value;
                else if (modal1.name == "phone") account.phoneNumber = modal1.value;
                const response = await fetch(`http://127.0.0.1:3001/updateProfile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({account, currentUpdate})
                });
                if (response.ok) {
                    const { status, message } = await response.json();
                    alert(message);
                    if (status) {
                        modal1.value = '';
                        handleCloseModal(state);
                        btn.type = "submit";
                        setDataProfile(account);
                        localStorage.user = account.userName;
                    }
                    else {
                        modal1.value = '';
                        btn.type = "submit";
                    }
                }
                else {
                    alert("Unable Update!\nPlease Try Again.");
                    modal1.value = '';
                    handleCloseModal(state);
                    btn.type = "submit";
                }
            }
        }
        else if(state == 2) {
            const modal2_1 = document.getElementById("modal2-txt1");
            const modal2_2 = document.getElementById("modal2-txt2");
            const btn = document.getElementById("modal2-btn");
            if(modal2_1.checkValidity() && modal2_2.checkValidity()){
                btn.type = "button";
                if(modal2_1.value == modal2_2.value) {
                    const currentUpdate = modal2_1.name;
                    account.password = modal2_1.value;
                    account.passwordHide = '';
                    for(let i=0;i<modal2_1.value.length;i++) account.passwordHide += '*';
                    const response = await fetch(`http://127.0.0.1:3001/updateProfile`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({account, currentUpdate})
                    });
                    if (response.ok) {
                        const { status, message } = await response.json();
                        alert(message);
                        if (status) {
                            modal2_1.value = '';
                            modal2_2.value = '';
                            handleCloseModal(state);
                            btn.type = "submit";
                            setDataProfile(account);
                        }
                        else {
                            modal2_1.value = '';
                            modal2_2.value = '';
                            btn.type = "submit";
                        }
                    }
                    else {
                        alert("Unable Update!\nPlease Try Again.");
                        modal2_1.value = '';
                        modal2_2.value = '';
                        handleCloseModal(state);
                        btn.type = "submit";
                    }
                }
                else {
                    alert("Password and ConfirmPassword don't match.");
                    modal2_2.value = '';
                    btn.type = "submit";
                }
            }
        }
        else if(state == 3) {
            const modal3_1 = document.getElementById("modal3-txt1");
            const modal3_2 = document.getElementById("modal3-txt2");
            const btn = document.getElementById("modal3-btn");
            if(modal3_1.checkValidity() && modal3_2.checkValidity()){
                btn.type = "button";
                const currentUpdate = modal3_1.name;
                account.firstName = modal3_1.value;
                account.lastName = modal3_2.value;
                const response = await fetch(`http://127.0.0.1:3001/updateProfile`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({account, currentUpdate})
                });
                if (response.ok) {
                    const { status, message } = await response.json();
                    alert(message);
                    if (status) {
                        modal3_1.value = '';
                        modal3_2.value = '';
                        handleCloseModal(state);
                        btn.type = "submit";
                        setDataProfile(account);
                    }
                    else {
                        modal3_1.value = '';
                        modal3_2.value = '';
                        btn.type = "submit";
                    }
                }
                else {
                    alert("Unable Update!\nPlease Try Again.");
                    modal3_1.value = '';
                    modal3_2.value = '';
                    handleCloseModal(state);
                    btn.type = "submit";
                }
            }
        }
    }

    return (
        <div class="ctn-p">
            <Header txtHead={"Profile"} icoHead={<FaUserCircle class="header-icon"/>}/>
            <Sidebar/>
            <div class="container">
                <div class="profile">
                    <div class="profile-form">
                        <FaUserCircle class="icon"/>
                        <div class="profile-form-textbox">
                            <div class="profile-form-textbox-label" id="f-fullname">
                                <h1>Fullname</h1>
                                <p>{dataProfile.firstName} {dataProfile.lastName}</p>
                            </div>
                            <div class="profile-form-textbox-edit" onClick={()=>handleOpenModal('input', 'Fullname', 3)}>
                                <FiEdit class="icon"/>
                            </div>
                        </div>
                        <div class="profile-form-textbox">
                            <div class="profile-form-textbox-label" id="f-username">
                                <h1>Username</h1>
                                <p>{dataProfile.userName}</p>
                            </div>
                            <div class="profile-form-textbox-edit" onClick={()=>handleOpenModal('input', 'Username', 1)}>
                                <FiEdit class="icon"/>
                            </div>
                        </div>
                        <div class="profile-form-textbox">
                            <div class="profile-form-textbox-label" id="f-password">
                                <h1>Password</h1>
                                <p>{dataProfile.passwordHide}</p>
                            </div>
                            <div class="profile-form-textbox-edit" onClick={()=>handleOpenModal('password', 'Password', 2)}>
                                <FiEdit class="icon"/>
                            </div>
                        </div>
                        <div class="profile-form-textbox">
                            <div class="profile-form-textbox-label" id="f-email">
                                <h1>Email</h1>
                                <p>{dataProfile.email}</p>
                            </div>
                            <div class="profile-form-textbox-edit" onClick={()=>handleOpenModal('email', 'Email', 1)}>
                                <FiEdit class="icon"/>
                            </div>
                        </div>
                        <div class="profile-form-textbox">
                            <div class="profile-form-textbox-label" id="f-phone">
                                <h1>Phone Number</h1>
                                <p>{dataProfile.phoneNumber}</p>
                            </div>
                            <div class="profile-form-textbox-edit" onClick={()=>handleOpenModal('tel', 'Phone Number', 1)}>
                                <FiEdit class="icon"/>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal">
                    <div class="modal-hidden" onClick={()=>handleCloseModal(1)}></div>
                    <div class="modal-form">
                        <form>
                            <div>
                                <div class="modal-form-textbox">
                                    <input type="email" class="modal-form-textbox-field" placeholder="Email" name="email" id="modal1-txt" maxlength="30" pattern="[a-z0-9._+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required/>
                                    <label for="email" class="modal-form-textbox-label">Email</label>
                                </div>
                            </div>
                            <button type="submit" class="modal-form-btn" id="modal1-btn" onClick={()=>onPressSave(1)}>
                                SAVE
                            </button>
                        </form>
                    </div>
                </div>
                <div class="modal2">
                    <div class="modal-hidden" onClick={()=>handleCloseModal(2)}></div>
                    <div class="modal2-form">
                        <form>
                            <div>
                                <div class="modal-form-textbox">
                                    <input type="password" class="modal-form-textbox-field" placeholder="Old Password" name="old_pass" id="old_pass" disabled/>
                                    <label for="old_pass" class="modal-form-textbox-label">Old Password</label>
                                </div>
                            </div>
                            <div>
                                <div class="modal-form-textbox">
                                    <input type="password" class="modal-form-textbox-field" placeholder="New Password" name="pass" id="modal2-txt1" maxlength="15" pattern=".{8,}" required/>
                                    <label for="pass" class="modal-form-textbox-label">New Password</label>
                                </div>
                            </div>
                            <div>
                                <div class="modal-form-textbox">
                                    <input type="password" class="modal-form-textbox-field" placeholder="Confirm New Password" name="con_new_pass" id="modal2-txt2" maxlength="15" pattern=".{8,}" required/>
                                    <label for="con_new_pass" class="modal-form-textbox-label">Confirm New Password</label>
                                </div>
                            </div>
                            <button type="submit" class="modal-form-btn" id="modal2-btn" onClick={()=>onPressSave(2)}>
                                SAVE
                            </button>
                        </form>
                    </div>
                </div>
                <div class="modal3">
                    <div class="modal-hidden" onClick={()=>handleCloseModal(3)}></div>
                    <div class="modal3-form">
                        <form>
                            <div>
                                <div class="modal-form-textbox">
                                    <input type="input" class="modal-form-textbox-field" placeholder="firstname" name="firstname" id="modal3-txt1" maxlength="10" pattern="([a-zA-Z]){2,}" required/>
                                    <label for="firstname" class="modal-form-textbox-label">Firstname</label>
                                </div>
                            </div>
                            <div>
                                <div class="modal-form-textbox">
                                    <input type="input" class="modal-form-textbox-field" placeholder="lastname" name="lastname" id="modal3-txt2" maxlength="16" pattern="([a-zA-Z]){2,}" required/>
                                    <label for="lastname" class="modal-form-textbox-label">Lastname</label>
                                </div>
                            </div>
                            <button type="submit" class="modal-form-btn" id="modal3-btn" onClick={()=>onPressSave(3)}>
                                SAVE
                            </button>
                        </form>
                    </div>
                </div>
            </div>            
        </div>
    );
}
export default Profile;