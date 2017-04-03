// @flow

import React from 'react';
import { render } from 'react-dom'
import { Router, Route, hashHistory } from 'react-router'

class Menu extends React.Component {
    render() {


        return <div>Menu: <a href="/#/">Customers</a></div>;
    }
}

class CustomerService {

    headers = {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
    };
    url = 'localhost:3000';
    static instance = null;
    lastId = 0;
    customers = [];

    // Return singleton
    static get() {
        if (!this.instance)
            this.instance = new CustomerService();
        return this.instance;
    }

    constructor() {
        this.customers.push({id: ++this.lastId, name: "Ola", city: "Trondheim"});
        this.customers.push({id: ++this.lastId, name: "Kari", city: "Oslo"});
        this.customers.push({id: ++this.lastId, name: "Per", city: "Tromsø"});
    }

    // Returns a manually created promise since we are later going to use fetch(),
    // which also returns a promise, to perform an http request.


    getCustomers() {

        let x = JSON.stringify({'sds': 'sdsd'});
        console.log(x);

        return new Promise((resolve, rejected) => {
            fetch('http://localhost:3000/get-customers', {
                method: 'GET', headers: this.headers
            }).then((data) => {
                let a = data.text().then((resp) => {
                    let listed = JSON.parse(resp);
                    console.log(listed);
                    resolve(listed);

                }, (err) => {
                    console.log(err)
                });
                return a;
            }).catch((err) => {
                console.log(err)
            })
        })
        /*
         return new Promise((resolve, reject)=>{


         var customer_id_and_names=[];
         for(var c=0;c<this.customers.length;c++) {
         customer_id_and_names.push({id: this.customers[c].id, name: this.customers[c].name});
         }
         resolve(customer_id_and_names);
         });*/
    }

    getCustomer(customerId) {
        return new Promise((resolve, reject) => {
            for (var c = 0; c < this.customers.length; c++) {
                if (this.customers[c].id == customerId) {
                    resolve(this.customers[c]);
                    return;
                }
            }
            reject("Customer not found");
        });
    }

    addCustomer(name, city) {
        return new Promise((resolve, reject) => {
            if (name && city) {
                fetch('http://localhost:3000/add-customer', {
                    method: 'put',
                    headers: this.headers,
                    body: JSON.stringify({'customer': {id: null, 'name': name, 'city': city}})
                }).then((data) => {
                    data.text()
                        .then((resp) => {
                            if (resp !== null) {
                                this.customers.push({id: resp, name: name, city: city});
                                resolve(resp);
                                return;
                            }
                        }, (err) => {
                            console.log(err)
                        });
                }).catch((err) => {
                    console.log(err)
                })
            }
            reject("name or city empty");
        })
    };


    addCustomer2(name, city) {
        return new Promise((resolve, reject)=>{
            if(name && city) {
                this.customers.push({id: ++this.lastId, name: name, city: city});
                resolve(this.lastId);
                return;
            }
            reject("name or city empty");
        });
    }

    deleteCustomer(id) {
        // prompt("p");
        return new Promise((resolve, reject) => {
                fetch('http://localhost:3000/delete-customer', {
                    method: 'delete',
                    headers: this.headers,
                    body: JSON.stringify({'customer': {id: id, 'name': '', 'city': ''}})
                }).then((data) => {
                    data.text()
                        .then((resp) => {
                            console.log(resp)
                            if (resp !== null) {
                                console.log('res[')

                                for (let i = 0; i < this.customers.length; ++i){
                                    if (this.customers[i].id === id) {
                                        this.customers.splice(i, 1);
                                        break;
                                    }
                                }
                                resolve(this.lastId);
                            }
                        }, (err) => {
                            console.log(err)
                        });
                }).catch((err) => {
                    console.log(err)
                });
                // this.customers.push({id: ++this.lastId, name: 'name', city: 'city'});

                console.log('clicked!!!');
                return;
            }
        );
    }

    deleteCustomer2(id) {
        // prompt("p");
        return new Promise((resolve, reject) => {
                // this.customers.push({id: ++this.lastId, name: 'name', city: 'city'});
                for (let i = 0; i < this.customers.length; ++i){
                    if (this.customers[i].id === id) {
                        this.customers.splice(i, 1);
                        break;
                    }
                }
                resolve(this.lastId);
                console.log('clicked!!!');
                return;
            }
        );
    }

    changeCustomer(id, customer) {
        return new Promise((resolve, reject) => {
            fetch('/update-customer', {
                method: 'put',
                headers: this.headers,
                body: JSON.stringify(customer)
        }).then((data) => {
                for (let i = 0; i < this.customers.length; ++i){
                    if (this.customers[i].id === id) {
                        this.customers[i] = customer;
                        resolve(this.lastId);
                        return;
                        }}
                }, (err) => {
                    console.log(err)
                });
        }).catch((err) => {
            console.log(err)
        });

        /*return new Promise( (resolve, reject) => {


         for (let i = 0; i < this.customers.length; ++i){
         if (this.customers[i].id === id) {
         this.customers[i] = customer;
         resolve(this.lastId);
         return;
         }
         }
         })*/
    };


    fetchtry = () => {
        var myHeaders = new Headers();


        fetch('/test')
            .then(json)
            .then((data) => {
                console.log('ee' + data)
            })
            .catch((err) => {console.log(err)});
    }

}

class CustomerListComponent extends React.Component {
    state={status: "", customers: [], newCustomerName: "", newCustomerCity: ""};

    constructor() {
        super();

        CustomerService.get().getCustomers().then((result)=>{
            this.setState({status: "successfully loaded customer list", customers: result});
        }).catch((reason)=>{
            this.setState({status: "error: "+reason});
        });
    }

    delCustomers = (id) => {
        console.log(id);

        // CustomerService.get().getCustomer()


        CustomerService.get().deleteCustomer(id).then( (result) => {
            for (let i = 0; i < this.state.customers.length; ++i){
                if (this.state.customers[i].id === id) {
                    this.state.customers.splice(i, 1);
                    break;
                }
            }
            this.setState({status: "successfully deleted customer", customers: this.state.customers, newCustomerName: "", newCustomerCity: ""});

            //
        }).catch((reason) => {this.setState({status: 'error' + reason})})
    };

    // Event methods, which are called in render(), are declared as properties:
    onNewCustomerFormChanged = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }

    // Event methods, which are called in render(), are declared as properties:
    onNewCustomer = (event) => {
        event.preventDefault();
        var name=this.state.newCustomerName;
        var city=this.state.newCustomerCity;
        CustomerService.get().addCustomer(name, city).then((result)=>{
            this.state.customers.push({id: result, name: name, city});
            this.setState({status: "successfully added new customer", customers: this.state.customers, newCustomerName: "", newCustomerCity: ""});
        }).catch((reason)=>{
            this.setState({status: "error: "+reason});
        });
    };

    send = () => {

        let x = JSON.stringify({'sds': 'sdsd'});
        console.log(x);

        fetch('http://localhost:3000/test', {
            method: 'GET',

        }).then( (data) => {
            let a = data.text().then((resp) => {(
                console.log(JSON.parse(resp)))

            }, (err) => {console.log(err)});
            return a;
        }).catch((err) => {console.log(err)})
    };

    forTry = (something) => {
        console.log(something)
        console.log(this.listItems)
    };


    render() {
        const style = {
            display: 'inline',
            margin: '0px',
            font: '20px',
            color: 'red'
        };



        let listItems = this.state.customers.map((customer) =>
            <li key={customer.id}><a href={"/#/customer/"+customer.id}>{customer.name}</a><button onClick={() => this.delCustomers(customer.id)}>delete</button></li>
        );
        return <div style={style}>

            <a href={"/#/about"}>About</a>
            <div>status: {this.state.status}<br/><ul>{listItems}</ul>
                <form onSubmit={this.onNewCustomer} onChange={this.onNewCustomerFormChanged}>
                    <label>Name:<input type="text" name="newCustomerName" value={this.state.newCustomerName} /></label>
                    <label>City:<input type="text" name="newCustomerCity" value={this.state.newCustomerCity} /></label>
                    <input type="submit" value="New Customer"/>
                </form>

                <button onClick={this.send}>send</button>
            </div>
        </div>
    }
}

class CustomerDetailsComponent extends React.Component {
    state={status: "", customer: {}, newCustomerName: "", newCustomerCity: ''};

    constructor(props) {
        super(props);

        CustomerService.get().getCustomer(props.params.customerId).then((result)=>{
            this.setState({status: "successfully loaded customer details", customer: result});
        }).catch((reason)=>{
            this.setState({status: "error: "+reason});
        });
    }



    changeCustomer = (event) => {
        event.preventDefault();
        let customer = this.state.customer;
        this.state.customer.city = this.state.newCustomerCity;
        this.setState({status: 'all good', customer : {id: customer.id, name: this.state.newCustomerName, city: this.state.newCustomerCity}});
        CustomerService.get().changeCustomer(this.state.customer.id, {id: customer.id, name: this.state.newCustomerName, city: this.state.newCustomerCity});
    };




    onNewCustomerFormChanged = (event) => {
        this.setState({[event.target.name]: event.target.value});
    }
    render() {
        return <div>status: {this.state.status}<br/>
            <ul>
                <li>name: {this.state.customer.name}</li>
                <li>city: {this.state.customer.city}</li>
            </ul>
            <form onSubmit={this.changeCustomer} onChange={this.onNewCustomerFormChanged}>
                <label>Name:<input type="text" name="newCustomerName" value={this.state.newCustomerName} /></label>
                <label>City:<input type="text" name="newCustomerCity" value={this.state.newCustomerCity} /></label>
                <input type="submit" value="Edit customer"/>
            </form>
        </div>
    }
}

class About extends React.Component {
    constructor() {
        super();
    }

    render() {
        return <div>
            <h2>This is an about for React app</h2>
        </div>

    }

}

class Routes extends React.Component {
    render() {
        return <Router history={hashHistory}>
            <Route exact path="/" component={CustomerListComponent}/>
            <Route path="/customer/:customerId" component={CustomerDetailsComponent}/>
            <Route path="/about" component={About}/>
        </Router>;
    }
}

render(<div>
    <Menu/>
    <Routes/>
</div>, document.getElementById('root'));

