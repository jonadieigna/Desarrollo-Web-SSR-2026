import listUsers from './users.service.js';

export default function getUsers(req, res) {
  const users = listUsers();
  res.json({ users });
}