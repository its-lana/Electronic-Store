import React from 'react';
import { Link, withRouter } from 'react-router-dom';

const Product = props => {

    const url = props.match.url === '/' ? '/products/all' : props.match.url;

    return (
        <Link to={`${url}/${props.slug}`}>
            <div className="Product">
                <div className="ProductImage">
                    <img alt="" src={props.productPic[0].img} width="250" height="10" />
                </div>
                <div className="ProductDetails">
                    <p>{props.name}</p>
                    <p>Rp {props.price}</p>
                </div>
            </div>
        </Link>
    );
}

export default withRouter(Product);