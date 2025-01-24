import React, { useState, useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  DatePicker,
  InputNumber,
  Button,
  message,
} from "antd";
import dayjs from "dayjs";
import useAPIPrivate from "../../hooks/useAPIPrivate";

const AddEditCoupons = ({
  data,
  visible,
  setVisible,
  fetchCoupons,
  setSelectedCoupon,
}) => {
  const [form] = Form.useForm();
  const apiPrivate = useAPIPrivate();
  useEffect(() => {
    if (data?.id) {
      form.setFieldsValue({
        ...data,
        expiryDate: data.expiryDate ? dayjs(data.expiryDate) : null,
      });
    } else {
      form.resetFields();
    }
  }, [data?.id, form]);

  const handleSave = async (values) => {
    if (data?.id) {
      try {
        const values = await form.validateFields();
        const formattedData = {
          ...values,
          expiryDate: values.expiryDate
            ? values.expiryDate.toISOString()
            : null,
        };
        const res = await apiPrivate.patch(`coupon/${data?.id}`, formattedData);
        console.log(res, "repsons eof update coupon");
        if (res?.status === 200) {
          message.success("Coupon updated successfully!");
          fetchCoupons();
          setSelectedCoupon(null);
          setVisible(false);
          form.resetFields();
        }
        // onSave(formattedData);
      } catch (error) {
        console.error("Validation failed:", error);
      }
    } else {
      try {
        const values = await form.validateFields();
        const formattedData = {
          ...values,
          expiryDate: values.expiryDate
            ? values.expiryDate.toISOString()
            : null,
        };

        const res = await apiPrivate.post(`coupon`, formattedData);
        console.log(res, "repsons eof add coupon");
        if (res?.status === 201) {
          message.success("Coupon added successfully!");
          fetchCoupons();
          setVisible(false);
          setSelectedCoupon(null);
          form.resetFields();
        }
      } catch (error) {
        console.error("Validation failed:", error);
      }
    }
  };

  return (
    <Modal
      title={data?.id ? "Edit Coupon" : "Add Coupon"}
      open={visible}
      onCancel={() => {
        setSelectedCoupon(null);
        setVisible(false);
        form.resetFields();
      }}
      onClose={() => {
        setSelectedCoupon(null);
        setVisible(false);
        form.resetFields();
      }}
      footer={null}>
      <Form form={form} layout="vertical" onFinish={handleSave}>
        <Form.Item
          label="Coupon Code"
          name="code"
          rules={[
            { required: true, message: "Please enter the coupon code!" },
          ]}>
          <Input placeholder="Enter coupon code" />
        </Form.Item>

        <Form.Item
          label="Job Limit"
          name="jobLimit"
          rules={[{ required: true, message: "Please enter the job limit!" }]}>
          <InputNumber
            min={1}
            placeholder="Enter job limit"
            className="w-full"
          />
        </Form.Item>

        <Form.Item label="Expiry Date" name="expiryDate">
          <DatePicker
            className="w-full"
            placeholder="Select expiry date (optional)"
          />
        </Form.Item>

        <div className="flex justify-end space-x-2">
          <Button onClick={() => setVisible(false)}>Cancel</Button>
          <Button type="primary" onClick={handleSave}>
            {data?.id ? "Update" : "Add"}
          </Button>
        </div>
      </Form>
    </Modal>
  );
};

export default AddEditCoupons;
