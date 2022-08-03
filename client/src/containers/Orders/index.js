/* eslint-disable no-unused-vars */
/* eslint-disable jsx-a11y/anchor-is-valid */
/* eslint-disable jsx-a11y/alt-text */
import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './style.css';
import Header from '../../components/Header/Header';
import * as authActions from '../../store/actions/authActions';
import { connect } from 'react-redux';
import { base_url } from '../../constants';

class Orders extends Component{

    state = {
        ordersList: [],
        confirmPayment: false
        // msgCnfrmPymn : null
    }

    componentDidMount(){

        if(!this.props.auth.isAuthenticated){
            this.props.getToken()
            .then(result => {
                if(result){
                    this.getOrders();
                }else{
                    this.props.history.push('/login');
                }
            })
        }else{
            this.getOrders();
        }

        
    }

    getOrders = () => {
        console.log(this.props.auth.isAuthenticated)
        const token =  this.props.auth.token;
        const userId = this.props.auth.user.userId;
        fetch(`${base_url}/order/getorders/${userId}`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        })
        .then(response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse);
            this.setState({
                ordersList: jsonResponse.message
            });
        })
        .catch(error => {
            console.log(error);
        })
    }

    konfirmasiPembayaran = (orderId) => {
        this.setState({
            confirmPayment: true,                
        });
        console.log(this.props.auth.isAuthenticated)
        const token =  this.props.auth.token;
        const userId = this.props.auth.user.userId;
        fetch(`${base_url}/order/confirmPayment/${userId}/${orderId}`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        })
        // .then(response => response.json())
        .then(jsonResponse => {
            // console.log(jsonResponse);
            
        })
        .catch(error => {
            console.log(error);
        })
    }

    konfirmasiPenerimaan = (orderId) => {
        console.log(this.props.auth.isAuthenticated)
        const token =  this.props.auth.token;
        const userId = this.props.auth.user.userId;
        fetch(`${base_url}/order/updateordercompleted/${orderId}`, {
            headers: {
                'Content-Type': 'application/json',
                'auth-token': token
            }
        })
        .then(response => response.json())
        .then(jsonResponse => {
            console.log(jsonResponse);
            
        })
        .catch(error => {
            console.log(error);
        })
    }

    formatDate = (date) => {
        let d = new Date(date);
        return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
    }

    getOrderTotal = (id) => {
        const singleOrder = this.state.ordersList.find(order => order._id === id);
        let orderTotal = 0;
        singleOrder.order.forEach(order => {
            orderTotal = orderTotal + (order.price * order.quantity)
        });

        return orderTotal+25000;
    }

    render() {

        

        return (
            <React.Fragment>
                <Header />
                <div className="Content">
                    <div className="Card">
                        <p className="CardText">Pesanan Saya</p>

                        {
                            this.state.ordersList.map(order => {
                                return (
                                    <div key={order._id} className="Order">
                                        <div className="OrderHeader">
                                            <a href="#">{order._id}</a>
                                        </div>
                                        <div className="OrderDescription">
                                            <div className="od1">
                                                <p className="odtitle">Alamat Pengiriman</p>
                                                <p>{`${order.address.alamat} ${order.address.kabupatenKota} ${order.address.provinsi} - ${order.address.kodePos}`}</p>
                                            </div> 
                                            { order.isOrderCompleted ?                                          
                                                <div className="od4">
                                                    {/* <p className="odtitle">Order Selesai</p> */}
                                                    <a className="odp1">Order Selesai</a>
                                                </div> : null
                                            //     <div className="od4">
                                            //     {/* <p className="odtitle">Order Selesai</p> */}
                                            //     <a className="odp1">{order.isOrderCompleted.toString()}</a>
                                            // </div> 
                                            }
                                            <div className="od2">
                                                <p className="odtitle">Metode Pembayaran</p>
                                                <a className="odp">{order.paymentType}</a>
                                            </div>
                                            <div className="od3">
                                                <p className="odtitle">Status Pembayaran</p>
                                                <a className="odp">{order.paymentStatus}</a>
                                            </div>
                                            {/* <div className="od3">
                                                <p className="odtitle">Payment Status</p>
                                                <a className="odp">{order.paymentStatus}</a>
                                            </div> */}
                                        
                                        </div>
                                        <div>
                                            {order.order.map(item => (
                                                <div key={item._id} style={{display: 'flex', alignItems: 'center', margin: '5px 0', borderBottom: '1px solid #cecece'}}>
                                                    <div style={{width: '80px', height: '80px', overflow: 'hidden', position: 'relative'}} className="ImageContainer">
                                                        <img style={{maxWidth: '100%', maxHeight: '100%', position: 'absolute', left: '50%', transform: 'translateX(-50%)'}} src={item.image}/>
                                                    </div>
                                                    <div>
                                                        <p className="odtitle">{item.name}</p>
                                                        <div style={{fontSize: '14px', color: '#555', fontWeight: 'bold'}}>
                                                        <p>Quantity: {item.quantity}</p>
                                                        <p>Rp {item.price * item.quantity}</p>
                                                        </div>
                                                       
                                                    </div>
                                                </div>
                                            ))}
                                            <div className="od4">
                                            <br></br><p className="odtitle">Konfirmasi Pembayaran</p>
                                                {/* <div className="PlaceOrder"> */}
                                                {
                                                    order.paymentStatus !== 'Lunas' ?
                                                    <div>
                                                        <button className="PlaceOrderButton" onClick={() => this.konfirmasiPembayaran(order._id)}>Konfirmasi</button>
                                                    </div> : null
                                                }
                                                {/* </div> */}
                                                {/* <a className="odp">{order.paymentType}</a> */}

                                                {
                                                    order.paymentStatus === 'Lunas' ?
                                                    <div>
                                                        <p className="od6">Pembayaran anda sudah terkonfirmasi</p><br></br>
                                                    </div> :
                                                    <div>
                                                        {
                                                            order.confirmPayment ?
                                                            <div>
                                                                <p className="od5">Sedang dilakukan pengecekan</p><br></br>
                                                            </div> : 
                                                            <div>
                                                                <p className="od5">Silakan konfirmasi jika anda sudah transfer!</p><br></br>
                                                            </div>
                                                        }
                                                    </div>
                                                }
                                                
                                            
                                            </div>
                                            {order.paymentStatus === 'Lunas' ?
                                                <div className="od4">
                                                    <p className="odtitle">No Resi JNE</p>
                                                    <a className="odp">{order.noResi}</a><br></br><br></br>
                                                </div> : null
                                            }
                                            <div className="od4">
                                                { order.paymentStatus === 'Lunas' ?
                                                <div>                                                    
                                                    <p className="odtitle">Konfirmasi Penerimaan Produk</p>
                                                    { !order.isOrderCompleted ?
                                                    <div>
                                                        <button className="PlaceOrderButton" onClick={() => this.konfirmasiPenerimaan(order._id)}>Konfirmasi</button><br></br>
                                                    </div> : null  
                                                    }                                                                                          
                                                    {
                                                        !order.isOrderCompleted ?                                                    
                                                        <div>
                                                            <p className="od5">Silakan konfirmasi ketika produk sudah sampai!</p><br></br>
                                                        </div> 
                                                        : 
                                                        <div>
                                                            <p className="od6">Penerimaan produk sudah terkonfirmasi!</p><br></br>
                                                        </div> 
                                                    }
                                                        
                                                </div> : null
                                                }
                                                {/* <a className="odp">{order.paymentType}</a> */}
                                            </div>
                                        </div>
                                        <div className="OrderFooter">
                                            <p>Dipesan pada  <span>{this.formatDate(order.orderDate)}</span></p>
                                            <p>Total <span>Rp {this.getOrderTotal(order._id)}</span></p>
                                        </div>
                                    </div>
                                )
                            })
                        }

                    </div>
                </div>
            </React.Fragment>
        );
    }
}

const mapStateToProps = state => {
    return {
        auth: state.auth
    }
}
const mapDispatchToProps = dispatch => {
    return {
        getToken: () => dispatch(authActions.getToken())
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(Orders);