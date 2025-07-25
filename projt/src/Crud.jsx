import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  message,
  Space,
  Tag,
  Popconfirm
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  UserAddOutlined,
} from "@ant-design/icons";

const { Option } = Select;

const Crud = () => {
  const [form] = Form.useForm();
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isdModalOpen, setIsdModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState(null);


  const fetchUsers = async () => {
    try {
      const res = await axios.get("http://localhost:3000/users");
      setUsers(res.data);
    } catch (err) {
      message.error("Failed to fetch users");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const onFinish = async (values) => {
    try {
      if (editingUser) {
        await axios.put(`http://localhost:3000/users/${editingUser._id}`, values);
        message.success("User updated successfully");
      } else {
        await axios.post("http://localhost:3000/users", values);
        message.success("User added successfully");
      }
      fetchUsers();
      form.resetFields();
      setEditingUser(null);
      setIsModalOpen(false);
    } catch (err) {
      message.error("Something went wrong");
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
    form.setFieldsValue(user);
    setIsModalOpen(true);
  };
const handleCancel = () => {
  setIsdModalOpen(false);
  setSelectedUserId(null);
};

const handleOk = async () => {
    console.log(selectedUserId)
  try {
    await axios.delete(`http://localhost:3000/users/${selectedUserId}`);
    message.success("User deleted");
    fetchUsers();
  } catch {
    message.error("Delete failed");
  } finally {
    setIsdModalOpen(false);
    setSelectedUserId(null);
  }
};

  const handleDelete =async(id) => {
    setSelectedUserId(id);
  setIsdModalOpen(true); 

  };





  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      render: (text) => <span className="font-semibold text-gray-800">{text}</span>,
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Role",
      dataIndex: "role",
      render: (role) => {
        let color = role === "admin" ? "red" : role === "manager" ? "blue" : "green";
        return <Tag color={color}>{role.toUpperCase()}</Tag>;
      },
    },
    {
      title: "Actions",
      align: "center",
      render: (_, record) => (
        <Space>
          <Button
            type="default"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          />
          <Button
            type="primary"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
          />
        </Space>
      ),
    },
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 to-white min-h-screen ">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-2xl p-8">
        <div className="flex justify-between items-center mb-6 border-b pb-4">
          <h1 className="text-3xl font-bold text-gray-800">User Management</h1>
          <Button
            type="primary"
            icon={<UserAddOutlined />}
            onClick={() => {
              form.resetFields();
              setEditingUser(null);
              setIsModalOpen(true);
            }}
            className="shadow-md"
          >
            Add New User
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={users}
          rowKey="_id"
          pagination={{ pageSize: 6 }}
          bordered
          className="rounded-xl overflow-hidden shadow-md"
        />
      </div>

      <Modal
        title={editingUser ? "✏️ Edit User" : "➕ Add User"}
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        centered
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          className="pt-2"
        >
          <Form.Item name="name" label="Name" rules={[{ required: true }]}>
            <Input placeholder="e.g. John Doe" />
          </Form.Item>

          <Form.Item name="email" label="Email" rules={[{ required: true }]}>
            <Input placeholder="e.g. john@example.com" />
          </Form.Item>

          <Form.Item name="phone" label="Phone" rules={[{ required: true }]}>
            <Input placeholder="e.g. 090078601" />
          </Form.Item>

          <Form.Item name="role" label="Role" rules={[{ required: true }]}>
            <Select placeholder="Select role">
              <Option value="admin">Admin</Option>
              <Option value="user">User</Option>
              <Option value="manager">Manager</Option>
            </Select>
          </Form.Item>

          <Form.Item className="mt-6">
            <Button type="primary" htmlType="submit" block>
              {editingUser ? "Update User" : "Add User"}
            </Button>
          </Form.Item>
        </Form>
      </Modal>
<Modal
  title="Delete Confirmation"
  open={isdModalOpen}
  onOk={handleOk}
  onCancel={handleCancel}
  okText="Yes, Delete"
  cancelText="Cancel"
  okType="danger"
  centered
>
  <p>Are you sure you want to delete this user?</p>
</Modal>

    </div>
  );
};

export default Crud;
