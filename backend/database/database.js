const mysql = require("mysql");
const crypto = require("crypto");
const nodemailer = require('nodemailer');

const con = mysql.createConnection({
    host     : '127.0.0.1',
    /*port     : '3306',*/
    user     : 'root',
    password : 'Your Mysql Password',
    database : 'in_ex_accounting'
});

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: "Your Email Username",
      pass: "Your Email Password"
    },
    tls: {
        rejectUnauthorized: false
    }
});

con.connect((err) => {
    if (err) throw err;
    console.log("Connected!");
});

let id, sql, values;
const readDataQS = "SELECT * FROM ";
const insertDataQS = "INSERT INTO ";
const deleteDataQS = "DELETE FROM ";
const updateDataQS = "UPDATE ";

class database {
    verifyAccount = async (verifyHash) => {
        const response = await new Promise((resolve, reject) => {
            sql = readDataQS + `ACCOUNT WHERE verifyHash = "${verifyHash}"`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            if (results.length > 0) {
                sql = updateDataQS + `ACCOUNT SET verifyState = true WHERE verifyHash = "${verifyHash}"`;
                await con.query(sql);
                return {status:true};
            }
            else return {status:false};
        });
        return response;
    }

    forgotPassword = async (email) => {
        const response = await new Promise((resolve, reject) => {
            sql = readDataQS + `ACCOUNT WHERE email = "${email}"`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            if (results.length > 0) {
                if (results[0].verifyState) {
                    let cryptoPass;
                    const mykey = crypto.createDecipher('aes256', 'Your_PassWord');
                    cryptoPass = mykey.update(results[0].password, 'hex', 'utf8');
                    results[0].password = cryptoPass + mykey.final('utf8');

                    var mailOptions = {
                        from: "IN-EX Accounting <Your Email Username>",
                        to: email,
                        subject: "IN-EX Accounting Forgot Password",
                        html: `<body><p>YOUR PASSWORD : </p><b>${results[0].password}</b></body>`
                    };

                    return (await new Promise((resolve, reject) => {
                        transporter.sendMail(mailOptions, (error2, info) => {
                            if (error2) reject(error2);
                            resolve("success")
                        });
                    }).then(() => {
                        return {status:true, message:"Send password to email."};
                    }).catch(async () => {
                        return {status:false, message:"Unable to send password to email."};
                    }))
                }
                else return {status:false, message:"Unable to send password to email."};
            }
            else return {status:false, message:"Unable to send password to email."};
        });
        return response;
    }

    createAccount = async (account) => {
        let cryptoPass;
        account.userName = account.userName.toLowerCase();
        account.email = account.email.toLowerCase();
        account.password = account.password.toLowerCase();
        const mykey = crypto.createCipher('aes256', 'Your_PassWord');
        cryptoPass = mykey.update(account.password, 'utf8', 'hex');
        account.password = cryptoPass + mykey.final('hex');

        const response = await new Promise((resolve, reject) => {
            sql = readDataQS + `ACCOUNT WHERE userName = "${account.userName}" or email = "${account.email}" or phoneNumber = "${account.phoneNumber}"`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            if (results.length > 0) return {status:false, message:"this username or email or phone number has been used\nPlease fill it again."}
            else {
                const emailHash = crypto.createHash("sha256").update(account.email).digest('hex');
                account.verifyHash = emailHash
                account.verifyState = false;

                sql = insertDataQS + `ACCOUNT (firstName, lastName, userName, email, password, phoneNumber, verifyHash, verifyState) VALUES `;
                values = `("${account.firstName}", "${account.lastName}", "${account.userName}", "${account.email}", "${account.password}",
                             "${account.phoneNumber}", "${account.verifyHash}", ${account.verifyState})`;
                await con.query(sql + values);

                var mailOptions = {
                    from: "IN-EX Accounting <Your Email Username>",
                    to: account.email,
                    subject: "IN-EX Accounting Verify Email",
                    html: `<body><b>Click this <a href='http://localhost:3001/verifyEmail/${emailHash}'>link<a> for verify.</b></body>`
                };
                
                return (await new Promise((resolve, reject) => {
                    transporter.sendMail(mailOptions, (error2, info) => {
                        if (error2) reject(error2);
                        resolve("success")
                    });
                }).then(() => {
                    return {status:true, message:"Create Account Success!!"};
                }).catch(async () => {
                    sql = deleteDataQS + `ACCOUNT WHERE email = "${account.email}"`;
                    await con.query(sql);
                    return {status:false, message:"Create Account Failed!!\nPlease try again."};
                }))
            }
        });
        return response;
    }

    loginAccount = async (account) => {
        let cryptoPass;
        account.userName = account.userName.toLowerCase();
        account.password = account.password.toLowerCase();
        const mykey = crypto.createCipher('aes256', 'Your_PassWord');
        cryptoPass = mykey.update(account.password, 'utf8', 'hex');
        account.password = cryptoPass + mykey.final('hex');

        const response = await new Promise((resolve, reject) => {
            sql = readDataQS + `ACCOUNT WHERE userName = "${account.userName}"`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            if (results.length == 0) return {status:false, message:"Wrong username or password!!\nPlease try again."};
            else {
                if (results[0].password != account.password) return {status:false, message:"Wrong username or password!!\nPlease try again."};
                else {
                    if (results[0].verifyState) return {status:true, message:"Your email has been verify!!"};
                    else return {status:false, message:"Your email has not been verify!!"};
                }
            }
        });
        return response;
    }

    readProfile = async (userName) => {
        const response = await new Promise((resolve, reject) => {
            sql = readDataQS + `ACCOUNT WHERE userName = "${userName}"`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            let cryptoPass, cryptoPassHide = '';
            const mykey = crypto.createDecipher('aes256', 'Your_PassWord');
            cryptoPass = mykey.update(results[0].password, 'hex', 'utf-8');
            cryptoPass += mykey.final('utf-8');
            for(let i=0;i<cryptoPass.length;i++)
                cryptoPassHide += '*';
            const data = {
                firstName: results[0].firstName,
                lastName: results[0].lastName,
                userName: results[0].userName,
                password: cryptoPass,
                passwordHide: cryptoPassHide,
                email: results[0].email,
                phoneNumber: results[0].phoneNumber,
            }
            return {status:true, message:"success", data:data};
        }).catch((error) => {
            return {status:false, message:"fail", data:{}};
        });
        return response;
    }

    updateProfile = async (account, currentUpdate) => {
        let cryptoPass;
        account.userName = account.userName.toLowerCase();
        account.email = account.email.toLowerCase();
        account.password = account.password.toLowerCase();
        const mykey = crypto.createCipher('aes256', 'Your_PassWord');
        cryptoPass = mykey.update(account.password, 'utf8', 'hex');
        account.password = cryptoPass + mykey.final('hex');

        const response = await new Promise((resolve, reject) => {
            sql = readDataQS + `ACCOUNT WHERE `;
            if (currentUpdate == "email") sql += `email = "${account.email}"`;
            else if (currentUpdate == "username") sql += `userName = "${account.userName}"`;
            else if (currentUpdate == "phone") sql += `phoneNumber = "${account.phoneNumber}"`;
            else sql += `email = ""`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            if (results.length > 0) return {status:false, message:"this username or email or phone number has been used\nPlease fill it again."}
            else {
                sql = updateDataQS + `ACCOUNT SET firstName="${account.firstName}", lastName="${account.lastName}", userName="${account.userName}",
                                    email="${account.email}", password="${account.password}", phoneNumber="${account.phoneNumber}" `;
                if (currentUpdate != "email") sql += `WHERE email="${account.email}"`;
                else sql += `WHERE userName="${account.userName}"`;
                await con.query(sql);
                return {status:true, message:"Success"};
            }
        });
        return response;
    }

    createIncome = async (userName, income) => {
        const r1 = await new Promise((resolve, reject) => {
            sql = readDataQS + `ACCOUNT WHERE userName = "${userName}"`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            const dateTime = new Date(income.dateTime);
            const date = new Date(dateTime.getMonth()+1+"-"+dateTime.getDate()+"-"+dateTime.getFullYear()+" GMT+0000");
            const time = dateTime.getHours()+":"+dateTime.getMinutes()+":"+dateTime.getMilliseconds();
            await new Promise((resolve, reject) => {
                sql = readDataQS + `INCOMEDATE WHERE accountId = ${results[0].accountId} and date = "${date.toISOString().substring(0, date.toISOString().length-1)}"`;
                con.query(sql, (error2, results2) => {
                    if (error2) reject(error2);
                    resolve(results2);
                })
            }).then(async (results2) => {
                if(results2.length > 0) {
                    await new Promise((resolve, reject) => {
                        sql = readDataQS + `INCOMETIME WHERE incomeDateId = ${results2[0].incomeDateId} and time = "${time}"`;
                        con.query(sql, (error3, results3) => {
                            if (error3) reject(error3);
                            resolve(results3);
                        })
                    }).then(async (results3) => {
                        if(results3.length > 0) {
                            sql = insertDataQS + `INCOMEDATA (incomeTimeId, category, amount) VALUES `;
                            values = `(${results3[0].incomeTimeId}, "${income.category}", ${income.amount})`;
                            await con.query(sql + values);
                        }
                        else {
                            await new Promise((resolve, reject) => {
                                sql = insertDataQS + `INCOMETIME (incomeDateId, time) VALUES `;
                                values = `(${results2[0].incomeDateId}, "${time}")`;
                                con.query(sql + values, (error4, results4) => {
                                    if (error4) reject(error4);
                                    resolve(results4);
                                })
                            }).then(async (results4) => {
                                sql = insertDataQS + `INCOMEDATA (incomeTimeId, category, amount) VALUES `;
                                values = `(${results4.insertId}, "${income.category}", ${income.amount})`;
                                await con.query(sql + values);
                            });
                        }
                    })
                }
                else {
                    await new Promise((resolve, reject) => {
                        sql = insertDataQS + `INCOMEDATE (accountId, date) VALUES `;
                        values = `(${results[0].accountId}, "${date.toISOString().substring(0, date.toISOString().length-1)}")`;
                        con.query(sql + values, (error4, results4) => {
                            if (error4) reject(error4);
                            resolve(results4);
                        })
                    }).then(async (results4) => {
                        await new Promise((resolve, reject) => {
                            sql = insertDataQS + `INCOMETIME (incomeDateId, time) VALUES `;
                            values = `(${results4.insertId}, "${time}")`;
                            con.query(sql + values, (error5, results5) => {
                                if (error5) reject(error5);
                                resolve(results5);
                            })
                        }).then(async (results5) => {
                            sql = insertDataQS + `INCOMEDATA (incomeTimeId, category, amount) VALUES `;
                            values = `(${results5.insertId}, "${income.category}", ${income.amount})`;
                            await con.query(sql + values);
                        });
                    });
                }
            })
            return {status:true, message:"Create Income Success!!"};
        });
        return r1;
    }

    createExpense = async (userName, expense) => {
        const r1 = await new Promise((resolve, reject) => {
            sql = readDataQS + `ACCOUNT WHERE userName = "${userName}"`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            const dateTime = new Date(expense.dateTime);
            const date = new Date(dateTime.getMonth()+1+"-"+dateTime.getDate()+"-"+dateTime.getFullYear()+" GMT+0000");
            const time = dateTime.getHours()+":"+dateTime.getMinutes()+":"+dateTime.getMilliseconds();
            await new Promise((resolve, reject) => {
                sql = readDataQS + `EXPENSEDATE WHERE accountId = ${results[0].accountId} and date = "${date.toISOString().substring(0, date.toISOString().length-1)}"`;
                con.query(sql, (error2, results2) => {
                    if (error2) reject(error2);
                    resolve(results2);
                })
            }).then(async (results2) => {
                if(results2.length > 0) {
                    await new Promise((resolve, reject) => {
                        sql = readDataQS + `EXPENSETIME WHERE expenseDateId = ${results2[0].expenseDateId} and time = "${time}"`;
                        con.query(sql, (error3, results3) => {
                            if (error3) reject(error3);
                            resolve(results3);
                        })
                    }).then(async (results3) => {
                        if(results3.length > 0) {
                            sql = insertDataQS + `EXPENSEDATA (expenseTimeId, material, quantity, unitPrice, totalPrice) VALUES `;
                            const materials = expense.materials;
                            for(let i=0;i<materials.length;i++){
                                if(materials[i].state){
                                    values = `(${results3[0].expenseTimeId}, "${materials[i].material}", ${materials[i].quantity}, ${materials[i].unitPrice}, ${materials[i].totalPrice})`;
                                    await con.query(sql + values);
                                }
                            }
                        }
                        else {
                            await new Promise((resolve, reject) => {
                                sql = insertDataQS + `EXPENSETIME (expenseDateId, time) VALUES `;
                                values = `(${results2[0].expenseDateId}, "${time}")`;
                                con.query(sql + values, (error4, results4) => {
                                    if (error4) reject(error4);
                                    resolve(results4);
                                })
                            }).then(async (results4) => {
                                sql = insertDataQS + `EXPENSEDATA (expenseTimeId, material, quantity, unitPrice, totalPrice) VALUES `;
                                const materials = expense.materials;
                                for(let i=0;i<materials.length;i++){
                                    if(materials[i].state){
                                        values = `(${results4.insertId}, "${materials[i].material}", ${materials[i].quantity}, ${materials[i].unitPrice}, ${materials[i].totalPrice})`;
                                        await con.query(sql + values);
                                    }
                                }
                            });
                        }
                    })
                }
                else {
                    await new Promise((resolve, reject) => {
                        sql = insertDataQS + `EXPENSEDATE (accountId, date) VALUES `;
                        values = `(${results[0].accountId}, "${date.toISOString().substring(0, date.toISOString().length-1)}")`;
                        con.query(sql + values, (error4, results4) => {
                            if (error4) reject(error4);
                            resolve(results4);
                        })
                    }).then(async (results4) => {
                        await new Promise((resolve, reject) => {
                            sql = insertDataQS + `EXPENSETIME (expenseDateId, time) VALUES `;
                            values = `(${results4.insertId}, "${time}")`;
                            con.query(sql + values, (error5, results5) => {
                                if (error5) reject(error5);
                                resolve(results5);
                            })
                        }).then(async (results5) => {
                            sql = insertDataQS + `EXPENSEDATA (expenseTimeId, material, quantity, unitPrice, totalPrice) VALUES `;
                            const materials = expense.materials;
                            for(let i=0;i<materials.length;i++){
                                if(materials[i].state){
                                    values = `(${results5.insertId}, "${materials[i].material}", ${materials[i].quantity}, ${materials[i].unitPrice}, ${materials[i].totalPrice})`;
                                    await con.query(sql + values);
                                }
                            }
                        });
                    });
                }
            })
            return {status:true, message:"Create Expense Success!!"};
        });
        return r1;
    }

    readInEx = async (mode, id, startD=undefined, endD=undefined) => {
        let tx = 0, total = 0, data;
        await new Promise((resolve, reject) => {
            let strTime;
            if (startD == undefined && endD == undefined) strTime = ``;
            else if (startD != undefined && endD == undefined) strTime = ` and date > "${startD}"`;
            else if (startD == undefined && endD != undefined) strTime = ` and date < "${endD}"`;
            else if (startD != undefined && endD != undefined) strTime = ` and date >= "${startD}" and date < "${endD}"`;
            sql = readDataQS + `${mode}DATE WHERE accountId = ${id}${strTime} order by date desc`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            for(let i=0;i<results.length;i++){
                let total2 = 0;
                await new Promise((resolve, reject) => {
                    sql = readDataQS + `${mode}TIME WHERE ${mode}DateId = ${(mode=="expense")?results[i].expenseDateId:results[i].incomeDateId} order by time desc`;
                    con.query(sql, (error2, results2) => {
                        if (error2) reject(error2);
                        resolve(results2);
                    })
                }).then(async (results2) => {
                    for(let j=0;j<results2.length;j++){
                        let total3 = 0;
                        await new Promise((resolve, reject) => {
                            sql = readDataQS + `${mode}DATA WHERE ${mode}TimeId = ${(mode=="expense")?results2[j].expenseTimeId:results2[j].incomeTimeId}`;
                            con.query(sql, (error3, results3) => {
                                if (error3) reject(error3);
                                resolve(results3);
                            })
                        }).then(async (results3) => {
                            for(let l=0;l<results3.length;l++){
                                total += (mode=="expense")?results3[l].totalPrice:results3[l].amount;
                                total2 += (mode=="expense")?results3[l].totalPrice:results3[l].amount;
                                total3 += (mode=="expense")?results3[l].totalPrice:results3[l].amount;
                            }
                            results2[j].data = results3;
                            results2[j].tx = results3.length;
                            results2[j].total = total3;
                        });
                    }
                    results[i].data = results2;
                    results[i].tx = results2.length;
                    results[i].total = total2;
                });
            }
            data = results;
            tx = results.length;
        });
        const items = {
            tx: tx,
            total: total,
            data: data
        }
        return items;
    }
    readDashboard = async (userName) => {
        const response = await new Promise((resolve, reject) => {
            sql = readDataQS + `ACCOUNT WHERE userName = "${userName}"`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            id = results[0].accountId;
            
            const expenseTotal = await this.readInEx("expense", id);
            const incomeTotal = await this.readInEx("income", id);

            let date = new Date();
            let firstDay = new Date(date.getFullYear(), date.getMonth(), 1);   //.toISOString();
            let lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 0);   //.toISOString();
            let diff_time = lastDay.getTime() - firstDay.getTime();
            let diff_days = diff_time / (1000 * 3600 * 24);
            const itemsExpense = [], itemsIncome = [];
            let date1, date2;
            for(let i=0;i<diff_days+1;i++){
                date1 = new Date((date.getMonth()+1)+"/"+String(i+1)+"/"+date.getFullYear()+" GMT+0000"); 
                if(i == diff_days) 
                    date2 = new Date((date.getMonth()+2)+"/01/"+date.getFullYear()+" GMT+0000"); 
                else 
                    date2 = new Date((date.getMonth()+1)+"/"+String(i+2)+"/"+date.getFullYear()+" GMT+0000"); 
                //console.log(date1.toISOString(),date2.toISOString())
                const itemExpense = await this.readInEx("expense", id, date1.toISOString(), date2.toISOString());
                const itemIncome = await this.readInEx("income", id, date1.toISOString(), date2.toISOString());
                itemsExpense.push(itemExpense);
                itemsIncome.push(itemIncome);
            }
            let txIn=0, txEx=0, totalIn=0, totalEx=0;
            for(let i=0;i<diff_days+1;i++){
                txIn += itemsIncome[i].tx;
                txEx += itemsExpense[i].tx;
                totalIn += itemsIncome[i].total;
                totalEx += itemsExpense[i].total;
            }
            const expenseMonth = {
                tx: txEx,
                total: totalEx,
                data: itemsExpense
            }
            const IncomeMonth = {
                tx: txIn,
                total: totalIn,
                data: itemsIncome
            }
            const items = {
                expenseTotal: expenseTotal,
                incomeTotal: incomeTotal,
                expenseMonth: expenseMonth,
                incomeMonth: IncomeMonth,
                expenseDay: itemsExpense[date.getDate()-1],
                incomeDay: itemsIncome[date.getDate()-1],
                dayDiff: diff_days+1,
                firstDay: firstDay.toString(),
                lastDay: lastDay.toString()
            }
            return {status:true, message:"success", data:items};
        });
        return response;
    }

    readTransactions = async (userName) => {
        const response = await new Promise((resolve, reject) => {
            sql = readDataQS + `ACCOUNT WHERE userName = "${userName}"`;
            con.query(sql, (error, results) => {
                if (error) reject(error);
                resolve(results);
            })
        }).then(async (results) => {
            id = results[0].accountId;
            
            const expenseTotal = await this.readInEx("expense", id);
            const incomeTotal = await this.readInEx("income", id);

            const items = {
                expenseTotal: expenseTotal,
                incomeTotal: incomeTotal
            }
            return {status:true, message:"success", data:items};
        });
        return response;
    }
}
module.exports = new database();
