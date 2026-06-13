import { useCallback, useEffect, useState } from "react";
import { Button, Card, Popconfirm, Space, Table, Tag, Typography, message, Tooltip } from "antd";
import {
  CloudUploadOutlined,
  DatabaseOutlined,
  DeleteOutlined,
  DownloadOutlined,
  ReloadOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import { socket_url } from "../../../app/slice/baseQuery";
import { TOKEN } from "../../../helper/constant";
import { useGetMeQuery } from "../../../app/api/userApi";

const { Title, Text } = Typography;
const API = `${socket_url}/api/v1/db-backup`;

interface BackupLog {
  id: number;
  file: string | null;
  status: "success" | "failed";
  source: "auto" | "manual";
  size_mb: number | null;
  drive_status: string | null;
  drive_link: string | null;
  message: string | null;
  created_at: string;
}

export default function DatabaseBackup() {
  const { data: profile } = useGetMeQuery();
  const isSuperAdmin = profile?.data?.role_id === 1;

  const [running, setRunning] = useState(false);
  const [logs, setLogs] = useState<BackupLog[]>([]);
  const [logsLoading, setLogsLoading] = useState(false);

  const authHeader = { authorization: localStorage.getItem(TOKEN) || "" };

  const fetchLogs = useCallback(async () => {
    setLogsLoading(true);
    try {
      const res = await fetch(`${API}/logs?limit=50`, { headers: authHeader });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) setLogs(data.data || []);
    } catch (_) {
      /* ignore */
    } finally {
      setLogsLoading(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (isSuperAdmin) fetchLogs();
  }, [isSuperAdmin, fetchLogs]);

  const downloadBackup = async (record: BackupLog) => {
    try {
      const res = await fetch(`${API}/download/${record.id}`, { headers: authHeader });
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        message.error(d?.message || "Download failed.");
        return;
      }
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = record.file || `backup-${record.id}.sql.gz`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch (_) {
      message.error("Could not download the file.");
    }
  };

  const deleteBackup = async (id: number) => {
    try {
      const res = await fetch(`${API}/${id}`, { method: "DELETE", headers: authHeader });
      const d = await res.json().catch(() => ({}));
      if (res.ok && d?.success) {
        message.success("Backup deleted.");
        fetchLogs();
      } else {
        message.error(d?.message || "Delete failed.");
      }
    } catch (_) {
      message.error("Could not delete the backup.");
    }
  };

  const runBackup = async () => {
    setRunning(true);
    try {
      const res = await fetch(`${API}/run`, { method: "POST", headers: authHeader });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.success) message.success(`Backup created: ${data.file}`);
      else message.error(data?.message || "Backup failed.");
    } catch (_) {
      message.error("Could not reach the server.");
    } finally {
      setRunning(false);
      fetchLogs();
    }
  };

  if (!isSuperAdmin) {
    return (
      <Card>
        <Text type="secondary">This page is available to Super Admins only.</Text>
      </Card>
    );
  }

  const columns = [
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (v: string) => dayjs(v).format("DD MMM YYYY, h:mm A"),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (s: string) =>
        s === "success" ? (
          <Tag color="green">Success</Tag>
        ) : (
          <Tag color="red">Failed</Tag>
        ),
    },
    {
      title: "Trigger",
      dataIndex: "source",
      key: "source",
      render: (s: string) => <Tag color={s === "manual" ? "blue" : "default"}>{s}</Tag>,
    },
    {
      title: "Drive",
      key: "drive_status",
      render: (_: unknown, r: BackupLog) => {
        if (r.drive_link)
          return (
            <a href={r.drive_link} target="_blank" rel="noopener noreferrer">
              View on Drive
            </a>
          );
        if (r.drive_status === "failed") return <Tag color="red">Failed</Tag>;
        return <Tag color="default">Local only</Tag>;
      },
    },
    {
      title: "Size",
      dataIndex: "size_mb",
      key: "size_mb",
      render: (v: number | null) => (v ? `${v} MB` : "—"),
    },
    {
      title: "Note",
      dataIndex: "message",
      key: "message",
      render: (v: string | null) => v || "",
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: unknown, r: BackupLog) => (
        <Space>
          {r.status === "success" && (
            <Tooltip title="Download">
              <Button
                size="small"
                icon={<DownloadOutlined />}
                onClick={() => downloadBackup(r)}
              />
            </Tooltip>
          )}
          <Popconfirm
            title="Delete this backup?"
            description="Removes it from Google Drive and history. This can't be undone."
            okText="Delete"
            okButtonProps={{ danger: true }}
            onConfirm={() => deleteBackup(r.id)}
          >
            <Tooltip title="Delete">
              <Button size="small" danger icon={<DeleteOutlined />} />
            </Tooltip>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
      <Card>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
            flexWrap: "wrap",
          }}
        >
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            <DatabaseOutlined style={{ fontSize: 28, color: "#1677ff" }} />
            <div>
              <Title level={5} style={{ margin: 0 }}>
                Database Backup
              </Title>
              <Text type="secondary" style={{ fontSize: 13 }}>
                Full backup (schema + data) uploaded to Google Drive. Runs
                automatically every 3 days at 2&nbsp;AM and is retained for 1 year.
              </Text>
            </div>
          </div>
          <Button
            type="primary"
            size="large"
            icon={<CloudUploadOutlined />}
            loading={running}
            onClick={runBackup}
          >
            {running ? "Backing up…" : "Backup Now"}
          </Button>
        </div>
      </Card>

      <Card
        title="Backup History"
        extra={
          <Tooltip title="Refresh">
            <Button
              icon={<ReloadOutlined />}
              onClick={fetchLogs}
              loading={logsLoading}
              size="small"
            />
          </Tooltip>
        }
      >
        <Table
          rowKey="id"
          size="small"
          loading={logsLoading}
          dataSource={logs}
          columns={columns}
          pagination={{ pageSize: 10 }}
          locale={{ emptyText: "No backups yet" }}
          scroll={{ x: true }}
        />
      </Card>
    </div>
  );
}
