/* eslint-disable no-unused-vars */
import React, { Component } from 'react';
import NormalInput from '../../../components/UI/NormalInput';


const AddressForm = props =>  {

        const {address} = props;
     

        return (
            <form onSubmit={props.addressSubmitHandler}>
                 <div className="Row">
                        <div style={{width: '49%'}}>
                            <NormalInput 
                                name="fullName"
                                value={address.fullName}
                                placeholder={'Nama Lengkap'}
                                inputHandler={props.inputHandler}
                                type="text"
                            />
                        </div>
                        <div style={{width: '49%'}}>
                            <NormalInput 
                                name="mobileNumber"
                                value={address.mobileNumber}
                                placeholder={'Nomor HP(ex. 6281234567891)'}
                                inputHandler={props.inputHandler}
                                type="text"
                            />
                        </div>
                    </div>
                    <div className="Row">
                        <NormalInput 
                                name="address"
                                value={address.address}
                                placeholder={'Alamat (Jalan dan Desa/Kelurahan)'}
                                inputHandler={props.inputHandler}
                                type="textarea"
                                style={{height: '60px'}}
                        />
                    </div>

                    <div className="Row">
                        <div style={{width: '49%'}}>
                            <NormalInput 
                                name="locality"
                                value={address.locality}
                                placeholder={'Kecamatan'}
                                inputHandler={props.inputHandler}
                                type="text"
                            />
                        </div>
                        <div style={{width: '49%'}}>
                            <NormalInput 
                                name="pinCode"
                                value={address.pinCode}
                                placeholder={'Kode Pos'}
                                inputHandler={props.inputHandler}
                                type="text"
                            />
                        </div>
                        
                    </div>
    
                    
    
                    <div className="Row">
                        <div style={{width: '49%'}}>
                            <NormalInput 
                                name="cityDistrictTown"
                                value={address.cityDistrictTown}
                                placeholder={'Kota/Kabupaten'}
                                inputHandler={props.inputHandler}
                                type="text"
                            />
                        </div>
                        <div style={{width: '49%'}}>
                            <NormalInput 
                                name="state"
                                value={address.state}
                                placeholder={'Provinsi'}
                                inputHandler={props.inputHandler}
                                type="text"
                            />
                        </div>
                    </div>
    
                    {/* <div className="Row">
                        <div style={{width: '49%'}}>
                            <NormalInput 
                                name="landmark"
                                value={address.landmark}
                                placeholder={'Landmark (Optional)'}
                                inputHandler={props.inputHandler}
                                type="text"
                            />
                        </div>
                        <div style={{width: '49%'}}>
                            <NormalInput 
                                name="alternatePhoneNumber"
                                value={address.alternateNumber}
                                placeholder={'Alternate Phone (Optional)'}
                                inputHandler={props.inputHandler}
                                type="text"

                            />
                        </div>
                    </div> */}

                    <div className="Row">
                        <button className="DeliveryAddressButton">Simpan Alamat</button>
                    </div>

            </form>
           
        );    
    
}

export default AddressForm;