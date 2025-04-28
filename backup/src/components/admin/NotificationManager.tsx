"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
}

type TargetType = "all" | "user";

export function NotificationManager() {
  const [message, setMessage] = useState("");
  const [type, setType] = useState<"info" | "warning" | "error" | "success">("info");
  const [targetType, setTargetType] = useState<TargetType>("all");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const router = useRouter();

  useEffect(() => {
    if (targetType === "user" && users.length === 0) {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const start = Date.now();
          const res = await fetch("/api/admin/users?page=1&pageSize=1000");
          const data = await res.json();
          console.log('Query took', Date.now() - start, 'ms');
          setUsers(data.users || []);
        } catch (err) {
          setUsers([]);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [targetType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    const userId = targetType === "user" ? selectedUserId : null;

    try {
      const response = await fetch("/api/admin/notifications", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message, type, userId }),
      });

      if (!response.ok) {
        throw new Error("Failed to save notification");
      }

      setMessage("");
      setType("info");
      setTargetType("all");
      setSelectedUserId(null);
      alert("Notification saved successfully!");
    } catch (error) {
      console.error("Error saving notification:", error);
      alert("Failed to save notification. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Notification Management</h2>
        <p className="text-muted-foreground">
          Create and manage notifications that will appear on user dashboards
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="type">Notification Type</Label>
          <Select
            value={type}
            onValueChange={(value: "info" | "warning" | "error" | "success") =>
              setType(value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="info">Info</SelectItem>
              <SelectItem value="warning">Warning</SelectItem>
              <SelectItem value="error">Error</SelectItem>
              <SelectItem value="success">Success</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Target</Label>
          <Select
            value={targetType}
            onValueChange={v => setTargetType(v as TargetType)}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              <SelectItem value="user">Specific User</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {targetType === "user" && (
          <div className="space-y-2">
            <Label>Select User</Label>
            <Select
              value={selectedUserId || ""}
              onValueChange={setSelectedUserId}
              disabled={loadingUsers || users.length === 0}
            >
              <SelectTrigger>
                <SelectValue placeholder={loadingUsers ? "Loading users..." : users.length === 0 ? "No users found" : "Select user"} />
              </SelectTrigger>
              <SelectContent>
                {users.length === 0 && !loadingUsers ? (
                  <div className="px-4 py-2 text-gray-500">No users found</div>
                ) : (
                  users.map((user) => (
                    <SelectItem key={user.id} value={user.id}>
                      {user.name || user.email} ({user.email})
                    </SelectItem>
                  ))
                )}
              </SelectContent>
            </Select>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="message">Message</Label>
          <Textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter notification message"
            required
          />
        </div>

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Saving..." : "Save Notification"}
        </Button>
      </form>

      <Link href="/dashboard" className="...">Back to Dashboard</Link>
    </div>
  );
} 