import React, { useState } from 'react';
import { useFormik } from 'formik';
import dataType from '../../constants/publish/publishConstant';

export const Search = (props) => {
    const [keySearch, setKeySearch] = useState('');
    const { handleSearch } = props;
    const [publishSelected, setPublishSelected] = useState('');

    // search event
    const handleClickSearch = () => {
        handleSearch(keySearch.trim(), formik.values.publishSelected);
    };

    //formik
    const formik = useFormik({
        enableReinitialize: true,
        initialValues: {
            publishSelected: publishSelected,
        },
    });
    return (
        <div className="d-flex">
            <select
                className="form-select form-control w-50 border-0 p-n5 rounded color-sort mr-2 "
                value={formik.values.publishSelected}
                onChange={formik.handleChange('publishSelected')}
                onBlur={formik.handleBlur('publishSelected')}
            >
                <option value="">-- Chọn trạng thái--</option>
                {dataType?.map((item, index) => (
                    <option value={item.value} key={index}>
                        {item.label}
                    </option>
                ))}
            </select>
            <div className="input-group">
                <input
                    type="text"
                    className="form-control bg-light ml-0 small"
                    placeholder="Tìm kiếm..."
                    onChange={(e) => setKeySearch(e.target.value)}
                    value={keySearch}
                />
                <div className="input-group-append">
                    <button type="button" className="btn btn-primary" onClick={() => handleClickSearch()}>
                        <i className="fas fa-search fa-sm" />
                    </button>
                </div>
            </div>
        </div>
    );
};
