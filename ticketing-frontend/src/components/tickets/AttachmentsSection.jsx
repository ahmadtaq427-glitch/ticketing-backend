import { useState } from 'react';
import api from '../../api/axios';
import { ENDPOINTS } from '../../api/endpoints';
import './AttachmentsSection.css';

export default function AttachmentsSection({ ticketId, initialAttachments }) {
    const [attachments, setAttachments] = useState(initialAttachments || []);
    const [uploading, setUploading] = useState(false);

    const handleFileUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            alert('File size must be less than 5MB');
            return;
        }

        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await api.post(ENDPOINTS.TICKET_ATTACHMENTS(ticketId), formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            setAttachments([...attachments, response.data.attachment]);
        } catch (err) {
            console.error(err);
            alert(err.response?.data?.message || 'Failed to upload file');
        } finally {
            setUploading(false);
            e.target.value = ''; 
        }
    };

    const handleDelete = async (attachmentId) => {
        if (!window.confirm('Delete this file?')) return;
        try {
            await api.delete(ENDPOINTS.ATTACHMENT(attachmentId));
            setAttachments(attachments.filter((a) => a.id !== attachmentId));
        } catch (err) {
            console.error(err);
            alert('Failed to delete file');
        }
    };

    const formatSize = (bytes) => {
        if (bytes < 1024) return bytes + ' B';
        if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
        return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
    };

    return (
        <div className="card attachments-section">
            <div className="attachments-header">
                <h3>Attachments ({attachments.length})</h3>
                <label className={`btn btn-sm btn-ghost ${uploading ? 'disabled' : ''}`}>
                    {uploading ? 'Uploading...' : '📎 Upload File'}
                    <input
                        type="file"
                        onChange={handleFileUpload}
                        style={{ display: 'none' }}
                        disabled={uploading}
                        accept=".jpg,.jpeg,.png,.gif,.webp,.pdf,.doc,.docx"
                    />
                </label>
            </div>

            {attachments.length === 0 ? (
                <p className="text-muted" style={{ fontSize: '14px' }}>No files attached yet.</p>
            ) : (
                <div className="attachments-grid">
                    {attachments.map((file) => {
                        const isImage = file.mime_type?.startsWith('image/');
                        const url = `http://127.0.0.1:8000/storage/${file.file_path}`;

                        return (
                            <div key={file.id} className="attachment-item">
                                <a href={url} target="_blank" rel="noopener noreferrer" className="attachment-preview">
                                    {isImage ? (
                                        <img src={url} alt={file.file_name} />
                                    ) : (
                                        <div className="attachment-icon">
                                            {file.mime_type?.includes('pdf') ? '📄' : '📎'}
                                        </div>
                                    )}
                                </a>
                                <div className="attachment-info">
                                    <span className="attachment-name" title={file.file_name}>{file.file_name}</span>
                                    <span className="attachment-size">{formatSize(file.file_size)}</span>
                                </div>
                                <button onClick={() => handleDelete(file.id)} className="attachment-delete" title="Delete">✕</button>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
}