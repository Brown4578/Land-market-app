import React, { useState, useEffect } from 'react';
import { Select, Spin } from 'antd';
import { servicePointService } from '../../_services';
// import { Msg } from 'common/i18n';

const { Option } = Select;
export const ServicePointSearch = ({
    size = "small",
    clear = false,
    point_type = null,
    type = null,
    ...props }) => {

    const [servicePoints, setServicePoints] = useState([]);
    const [value, setValue] = useState(undefined);
    const [fetching, setFetching] = useState(false);

    useEffect(() => {
        if (!clear) return;
        setValue(undefined);
    }, [clear]);

    useEffect(() => {
        getServicePoints({ point_type, type });
    }, [point_type, type]);

    const getServicePoints = (params) => {

        setServicePoints([]);
        setFetching(true);
        servicePointService.fetchServicePoints(params).then(response => {
            setServicePoints(response.data.content);
            setFetching(false);
        }).catch(error => { setServicePoints([]); setFetching(false); });
    };

    const handleServicePoint = (params) => {
        let servicePoint = null;
        if (params) {
            servicePoint = JSON.parse(params);
        }
        setValue(servicePoint ? servicePoint.name : null);
        props.params(servicePoint);
    };


    return (
        <Select
            allowClear
            showSearch
            placeholder={"Select a ServicePoint"}
            notFoundContent={fetching ? <Spin size="small" /> : null}
            filterOption={true}
            style={{ width: "100%" }}
            onChange={handleServicePoint}
            size={size}
            value={value ? value : undefined}
        >
            {!fetching && (
                <Select.Option key="empty" value={""} style={{ color: "#bfbfbf" }}>Select a ServicePoint</Select.Option>
            )}
            {servicePoints && servicePoints.map(item => (
                <Option key={item.id} value={JSON.stringify(item)} >
                    {item.name}
                </Option>
            ))}
        </Select>
    );
};

