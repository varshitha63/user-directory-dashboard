import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MoreHorizontal } from 'lucide-react';
import { User } from '../types';
import { motion } from 'framer-motion';

interface UserTableProps {
  users: User[];
}

export default function UserTable({ users }: UserTableProps) {
  const navigate = useNavigate();

  return (
    <div className="overflow-hidden rounded-xl border bg-card shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-100 dark:bg-gray-800 text-muted-foreground uppercase text-[11px] font-semibold">
            <tr>
              <th className="px-6 py-4">Name</th>
              <th className="px-6 py-4">Email</th>
              <th className="px-6 py-4">Phone</th>
              <th className="px-6 py-4">Company</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>

          <tbody className="divide-y">
            {users.map((user) => (
              <motion.tr
                key={user.id}
                whileHover={{ scale: 1.01 }}
                className="cursor-pointer"
                onClick={() => navigate(`/user/${user.id}`)}
              >
                <td className="px-6 py-4">{user.name}</td>
                <td className="px-6 py-4">{user.email}</td>
                <td className="px-6 py-4">{user.phone}</td>
                <td className="px-6 py-4">{user.company.name}</td>

                <td className="px-6 py-4 text-right">
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 hover:bg-gray-200 rounded"
                  >
                    <MoreHorizontal />
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}