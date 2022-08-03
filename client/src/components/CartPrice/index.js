import React from 'react';
import './style.css';
import { connect } from 'react-redux';

const CartPrice = props => {
    let delivery = 25000;
    // if(props.courier === 'JNE'){
    //     delivery = 30000;
    // }else{
    //     delivery = 20000;
    // }

    return (
        <div className="PriceWrapper">
            {/* show price */}
            <div className="CardTitle">
                <h3>Rincian Harga</h3>
            </div>
            <div className="CardBody">
                <div className="FinalBilling">
                    <div className="Row">
                        <p>Harga ({props.cart.cartCount})</p>
                        <p>Rp {props.cart.totalAmount}</p>
                    </div>
                    <div className="Row">
                        <p>Ongkos Kirim</p>
                        <p>Rp {delivery}</p>
                    </div>
                    <hr />
                    <div className="Row">
                        <h4>Total Pembayaran</h4>
                        <h4>Rp {props.cart.totalAmount + delivery}</h4>
                    </div>
                </div>
                
            </div>
        </div>
    );


}

const mapStateToProps = state => {
    return {
        cart: state.cart
    }
}

export default connect(mapStateToProps, null)(CartPrice);