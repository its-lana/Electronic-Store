import React, { Component } from 'react';
import Header from '../../components/Header/Header';
import './style.css';

class ThankYou extends Component{

    render() {

        const queryParams = this.props.location.search.split("?")[1];
        const orderId = queryParams.split("=")[1];
        console.log('test 123');

        return (
            <div>
                <Header />
                <div className="Content">
                    <div className="ThankyouPage">
                       <h1>Terima Kasih atas Orderan Anda!</h1>
                       {/* <p className="OrderId">Order id is: {orderId.toLocaleUpperCase()}</p> */}
                       <p>Silakan transfer ke BRIVA berikut : </p><br></br>
                       
                       <li>
                           <ul>123456789012345</ul><br></br>
                           {/* <ul>BNI 213456789012345</ul><br></br>
                           <ul>BCA 321456789012345</ul><br></br> */}
                       </li>

                       <p>Setelah pembayaran dilakukan, harap konfirmasi dengan mengklik tombol "Konfirmasi pembayaran" di Daftar Order</p>
                       {/* <p className="SmallText">You will receive an email confirmation shortly at email@gmail.com</p> */}
                    </div>
                </div>
            </div>
        );
    }

}

export default ThankYou;