import React from 'react';
import './style.css';
import RadioButton from '../../../components/UI/RadioButton';

const DeliveryAddress = props => {

    const {address} = props;

    return (
                <div style={{margin: '10px 0'}}>
                    <div className="AddressSelection" key={address._id}>
                        <RadioButton 
                            name="address"
                            label=""
                            value={address._id}
                            onChange={props.onAddressSelection}
                        />
                        <div>
                            <p className="AddressAuthor">{address.namaLengkap} {address.noHp}</p>
                            <p className="AuthorAddress">{address.alamat}, {address.kabupatenKota}, {address.provinsi} - {address.kodePos}</p>
                        </div>
                    </div>
                </div>
        );
 }

export default DeliveryAddress;