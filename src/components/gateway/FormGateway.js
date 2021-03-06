import React, {useEffect, useState} from "react";
import Card from "../common/Card";
import {useForm} from "react-hook-form";
import ListDevicesComponent from "../device/ListDevicesComponent";

function FormGateway({title, editGateway, cancelForm, saveValues, handleDelete}) {
    const {handleSubmit, register, errors, setError, clearError, setValue} = useForm();
    const [devicesChecked, setDevicesChecked] = useState([]);
    const [addDevices, setAddDevices] = useState([]);
    const [removeDevices, setRemoveDevices] = useState([]);
    const [cant, setCant] = useState(0);

    useEffect(() => {
        if (editGateway) {
            const rd = editGateway.devices.filter(i => !devicesChecked.includes(i._id)).map(dv => dv._id);
            const ad = devicesChecked.filter(i => !editGateway.devices.some(dv => dv._id === i));
            setRemoveDevices(rd);
            setAddDevices(ad);
        } else {
            setAddDevices(devicesChecked)
        }
    }, [devicesChecked, editGateway]);

    useEffect(() => {
        setCant(editGateway ? editGateway.devices.length + addDevices.length - removeDevices.length : 0);
    }, [devicesChecked, addDevices, removeDevices, editGateway]);

    useEffect(() => {
        if (cant > 10) {
            setError("devices", "max", "It should be less than 10 devices");
        }else{
            clearError('devices');
        }
    }, [cant, clearError, setError]);

    useEffect(() => {
        if (editGateway) {
            setValue(Object.keys(editGateway).map(k => ({[k]: editGateway[k]})));
            setDevicesChecked(editGateway.devices.map(d => d._id));
        }
    }, [editGateway, setValue]);

    const onSubmit = (values) => {
        if (Object.keys(errors) < 1) {
            saveValues(values);
        }
    };

    const onDelete = () => {
        handleDelete(editGateway._id)
    };

    return <Card
        col={12}
        title={title}
        footer={<div className="form-row justify-content-end">
            <div className="col-auto">
                <button className="btn btn-secondary btn-sm" onClick={cancelForm}>Cancel</button>
            </div>
            {editGateway && <div className="col-auto">
                <button id="button-delete" className="btn btn-danger btn-sm" onClick={onDelete}>Delete</button>
            </div>}
            <div className="col-auto">
                <button className="btn btn-primary btn-sm" id="button-save" onClick={handleSubmit(onSubmit)}>Save
                </button>
            </div>
        </div>}
        body={<form>
            <div className="row">
                <input
                    ref={register()}
                    type="hidden" name="_id"
                />
                {addDevices.map((dc, index) => <input
                    key={`${dc}_${index.toString()}`}
                    ref={register()}
                    type="hidden"
                    name={`addDevices[${index}]`}
                    value={dc}
                />)}
                {removeDevices.map((rd, index) => <input
                    key={`${rd}_${index.toString()}`}
                    ref={register()}
                    type="hidden"
                    name={`removeDevices[${index}]`}
                    value={rd}
                />)}
                <div className="form-group small col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <label>Serial:</label>
                    <input
                        ref={register({
                            required: "The field is required.",
                            pattern: {
                                value: /^[\S]+$/,
                                message: "Invalid format."
                            }
                        })}
                        type="text"
                        className={`form-control form-control-sm is-${errors.serial ? 'invalid' : 'valid'}`}
                        name="serial"
                    />
                    <div
                        className={`${errors.serial ? 'invalid' : 'valid'}-feedback`}>{errors.serial && errors.serial.message}</div>
                </div>
                <div className="form-group small col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <label>Name:</label>
                    <input
                        ref={register()}
                        type="text"
                        className={`form-control form-control-sm is-${errors.name ? 'invalid' : 'valid'}`}
                        name="name"
                    />
                    <div
                        className={`${errors.name ? 'invalid' : 'valid'}-feedback`}>{errors.name && errors.name.message}</div>
                </div>
                <div className="form-group small col-12 col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <label>Ipv4 Address:</label>
                    <input
                        id="input-address"
                        ref={register({
                            required: 'The field is required',
                            pattern: {
                                value: /\b((25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)(\.|$)){4}\b/
                            }
                        })}
                        type="text"
                        className={`form-control form-control-sm is-${errors.address ? 'invalid' : 'valid'}`}
                        name="address"
                    />
                    <div
                        id="error-address"
                        className={`${errors.address ? 'invalid' : 'valid'}-feedback`}>{errors.address && errors.address.message}</div>
                </div>
                <div className="col col-12">
                    <span>
                        <strong>{`Total devices: (${cant}). `}</strong>
                        <span className={`${errors.devices ? 'text-danger' : ''}`}>{`${errors.devices ? errors.devices.message : ''}`}</span>
                    </span>
                    <ListDevicesComponent
                        formControl
                        devicesChecked={devicesChecked}
                        setDevicesChecked={setDevicesChecked}
                    />
                </div>
            </div>
        </form>}
    />
};

export default FormGateway;