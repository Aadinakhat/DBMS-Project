import React, { useState, useEffect } from 'react';
import { 
    Cpu, 
    Plus, 
    Search, 
    HardDrive, 
    Trash2, 
    CheckCircle2, 
    AlertTriangle, 
    Eye,
    Layers,
    Monitor
} from 'lucide-react';
import { api } from '../api/client';
import { useToast } from '../context/ToastContext';
import Modal from '../components/common/Modal';
import ConfirmDialog from '../components/common/ConfirmDialog';
import EmptyState from '../components/common/EmptyState';
import LoadingSkeleton from '../components/common/LoadingSkeleton';

export default function LabsPage() {
    const toast = useToast();
    const [loading, setLoading] = useState(true);
    const [labs, setLabs] = useState([]);
    const [search, setSearch] = useState('');

    // Catalog for create lab
    const [softwareCatalog, setSoftwareCatalog] = useState([]);
    const [osCatalog, setOsCatalog] = useState([]);

    // Create Modal
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [formData, setFormData] = useState({
        lab_name: '',
        capacity: 30,
        gpu_capacity: 0,
        software_ids: [],
        os_ids: []
    });
    const [submitting, setSubmitting] = useState(false);

    // View Workstations Modal
    const [selectedLab, setSelectedLab] = useState(null);
    const [workstations, setWorkstations] = useState([]);
    const [loadingWs, setLoadingWs] = useState(false);

    // Delete confirm
    const [deleteId, setDeleteId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const loadLabs = async () => {
        try {
            setLoading(true);
            const res = await api.get('/labs', { search });
            if (res.success) setLabs(res.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoading(false);
        }
    };

    const loadCatalogs = async () => {
        try {
            const res = await api.get('/catalogs');
            if (res.success) {
                setSoftwareCatalog(res.data.software);
                setOsCatalog(res.data.operatingSystems);
            }
        } catch (err) {
            console.error('Catalogs error:', err);
        }
    };

    useEffect(() => {
        loadLabs();
        loadCatalogs();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        try {
            setSubmitting(true);
            const res = await api.post('/labs', formData);
            if (res.success) {
                toast.success(res.message);
                setIsAddOpen(false);
                setFormData({
                    lab_name: '',
                    capacity: 30,
                    gpu_capacity: 0,
                    software_ids: [],
                    os_ids: []
                });
                loadLabs();
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async () => {
        try {
            setDeleting(true);
            const res = await api.delete(`/labs/${deleteId}`);
            if (res.success) {
                toast.success('Laboratory removed successfully');
                setDeleteId(null);
                loadLabs();
            }
        } catch (err) {
            toast.error(err.message);
        } finally {
            setDeleting(false);
        }
    };

    const openWorkstations = async (lab) => {
        try {
            setSelectedLab(lab);
            setLoadingWs(true);
            const res = await api.get('/workstations', { lab_id: lab.lab_id });
            if (res.success) setWorkstations(res.data);
        } catch (err) {
            toast.error(err.message);
        } finally {
            setLoadingWs(false);
        }
    };

    const updateWsStatus = async (wsId, newStatus) => {
        try {
            const res = await api.put(`/workstations/${wsId}`, { status: newStatus });
            if (res.success) {
                toast.success(`Workstation updated to ${newStatus}`);
                setWorkstations(prev => prev.map(w => w.workstation_id === wsId ? { ...w, status: newStatus } : w));
                loadLabs();
            }
        } catch (err) {
            toast.error(err.message);
        }
    };

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-200">
                <div>
                    <h1 className="text-xl font-bold text-slate-900 tracking-tight">Laboratories & Physical Assets</h1>
                    <p className="text-xs text-slate-500 mt-0.5">
                        Relational tracking of lab facilities, GPU configurations, software licenses, and terminal health
                    </p>
                </div>
                <button
                    onClick={() => setIsAddOpen(true)}
                    className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white shadow-sm transition-colors self-start sm:self-auto"
                >
                    <Plus className="w-4 h-4" />
                    Register Laboratory
                </button>
            </div>

            {/* Search */}
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between gap-4">
                <div className="relative flex-1 max-w-sm">
                    <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                        type="text"
                        placeholder="Search labs by name..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && loadLabs()}
                        className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                    />
                </div>
                <button
                    onClick={loadLabs}
                    className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                >
                    Search
                </button>
            </div>

            {/* Labs Grid */}
            {loading ? (
                <LoadingSkeleton rows={4} cols={3} />
            ) : labs.length === 0 ? (
                <EmptyState
                    icon={Cpu}
                    title="No laboratories found"
                    description="Register a lab above to manage computing infrastructure."
                />
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                    {labs.map((lab) => (
                        <div 
                            key={lab.lab_id} 
                            className="bg-white rounded-xl border border-slate-200 shadow-xs p-5 flex flex-col justify-between hover:shadow-sm transition-shadow"
                        >
                            <div>
                                <div className="flex items-start justify-between gap-2 mb-2">
                                    <div className="flex items-center gap-2">
                                        <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                                            <Cpu className="w-5 h-5" />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-sm text-slate-900">{lab.lab_name}</h3>
                                            <span className="text-[10px] text-slate-400 font-mono">ID: #{lab.lab_id}</span>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setDeleteId(lab.lab_id)}
                                        className="p-1 text-slate-400 hover:text-rose-600 rounded transition-colors"
                                        title="Delete Lab (Tests FK RESTRICT if active)"
                                    >
                                        <Trash2 className="w-4 h-4" />
                                    </button>
                                </div>

                                {/* Capacity Badges */}
                                <div className="grid grid-cols-2 gap-2 my-3 text-xs">
                                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                                        <span className="text-[10px] text-slate-400 block uppercase">Max Capacity</span>
                                        <span className="font-bold text-slate-800">{lab.capacity} Seats</span>
                                    </div>
                                    <div className="p-2 rounded-lg bg-slate-50 border border-slate-100">
                                        <span className="text-[10px] text-slate-400 block uppercase">GPU Units</span>
                                        <span className={`font-bold ${lab.gpu_capacity > 0 ? 'text-indigo-600' : 'text-slate-500'}`}>
                                            {lab.gpu_capacity} Dedicated
                                        </span>
                                    </div>
                                </div>

                                {/* Hardware Health Indicator */}
                                <div className="mb-3">
                                    <div className="flex justify-between text-[11px] text-slate-500 mb-1">
                                        <span>Terminal Health</span>
                                        <span className="font-semibold text-slate-700">
                                            {lab.active_workstations || 0} active / {lab.total_workstations || 0} installed
                                        </span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden flex">
                                        <div
                                            className="bg-emerald-500 h-full"
                                            style={{ 
                                                width: `${lab.total_workstations ? (lab.active_workstations / lab.total_workstations) * 100 : 0}%` 
                                            }}
                                        ></div>
                                        <div
                                            className="bg-rose-500 h-full"
                                            style={{ 
                                                width: `${lab.total_workstations ? (lab.faulty_workstations / lab.total_workstations) * 100 : 0}%` 
                                            }}
                                        ></div>
                                    </div>
                                </div>

                                {/* Software & OS Tags */}
                                <div className="space-y-2 text-xs">
                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                            Installed Software (1NF Decomposed)
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {lab.installed_software ? (
                                                lab.installed_software.split(', ').map((sw, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 rounded bg-blue-50 text-blue-700 text-[10px] font-medium border border-blue-200">
                                                        {sw}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[11px] text-slate-400 italic">None registered</span>
                                            )}
                                        </div>
                                    </div>

                                    <div>
                                        <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1">
                                            Operating Systems
                                        </span>
                                        <div className="flex flex-wrap gap-1">
                                            {lab.installed_os ? (
                                                lab.installed_os.split(', ').map((os, idx) => (
                                                    <span key={idx} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-medium border border-slate-200">
                                                        {os}
                                                    </span>
                                                ))
                                            ) : (
                                                <span className="text-[11px] text-slate-400 italic">None registered</span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* View Terminals Button */}
                            <div className="pt-4 mt-3 border-t border-slate-100">
                                <button
                                    onClick={() => openWorkstations(lab)}
                                    className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-semibold rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-800 transition-colors"
                                >
                                    <Monitor className="w-3.5 h-3.5 text-blue-600" />
                                    Manage Workstations ({lab.total_workstations || 0})
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Register Lab Modal */}
            <Modal
                isOpen={isAddOpen}
                onClose={() => setIsAddOpen(false)}
                title="Register New Laboratory Facility"
                maxWidth="max-w-md"
            >
                <form onSubmit={handleCreate} className="space-y-4 text-xs">
                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Laboratory Name</label>
                        <input
                            type="text"
                            required
                            placeholder="e.g. Lab-301 (Cybersecurity Suite)"
                            value={formData.lab_name}
                            onChange={(e) => setFormData(p => ({ ...p, lab_name: e.target.value }))}
                            className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block font-medium text-slate-700 mb-1">Capacity (Seats)</label>
                            <input
                                type="number"
                                required
                                min="1"
                                value={formData.capacity}
                                onChange={(e) => setFormData(p => ({ ...p, capacity: parseInt(e.target.value, 10) }))}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                        <div>
                            <label className="block font-medium text-slate-700 mb-1">GPU Dedicated Units</label>
                            <input
                                type="number"
                                min="0"
                                value={formData.gpu_capacity}
                                onChange={(e) => setFormData(p => ({ ...p, gpu_capacity: parseInt(e.target.value, 10) }))}
                                className="w-full p-2 bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Installed Software Packages</label>
                        <div className="grid grid-cols-2 gap-2 max-h-36 overflow-y-auto p-2 bg-slate-50 rounded-lg border border-slate-200">
                            {softwareCatalog.map(sw => (
                                <label key={sw.software_id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.software_ids.includes(sw.software_id)}
                                        onChange={(e) => {
                                            const id = sw.software_id;
                                            setFormData(p => ({
                                                ...p,
                                                software_ids: e.target.checked
                                                    ? [...p.software_ids, id]
                                                    : p.software_ids.filter(x => x !== id)
                                            }));
                                        }}
                                        className="rounded border-slate-300 text-blue-600"
                                    />
                                    <span className="text-[11px] text-slate-700">{sw.software_name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div>
                        <label className="block font-medium text-slate-700 mb-1">Operating Systems</label>
                        <div className="grid grid-cols-2 gap-2 p-2 bg-slate-50 rounded-lg border border-slate-200">
                            {osCatalog.map(os => (
                                <label key={os.os_id} className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={formData.os_ids.includes(os.os_id)}
                                        onChange={(e) => {
                                            const id = os.os_id;
                                            setFormData(p => ({
                                                ...p,
                                                os_ids: e.target.checked
                                                    ? [...p.os_ids, id]
                                                    : p.os_ids.filter(x => x !== id)
                                            }));
                                        }}
                                        className="rounded border-slate-300 text-blue-600"
                                    />
                                    <span className="text-[11px] text-slate-700">{os.os_name}</span>
                                </label>
                            ))}
                        </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-3 border-t border-slate-100">
                        <button
                            type="button"
                            onClick={() => setIsAddOpen(false)}
                            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold rounded-lg"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg shadow-sm"
                        >
                            {submitting ? 'Registering...' : 'Register Lab'}
                        </button>
                    </div>
                </form>
            </Modal>

            {/* Manage Workstations Modal */}
            <Modal
                isOpen={!!selectedLab}
                onClose={() => setSelectedLab(null)}
                title={`Workstations in ${selectedLab?.lab_name}`}
                maxWidth="max-w-lg"
            >
                {loadingWs ? (
                    <LoadingSkeleton rows={5} cols={3} />
                ) : (
                    <div className="space-y-4">
                        <div className="text-xs text-slate-500">
                            Click on any workstation status to cycle through states: <strong>ACTIVE</strong> &bull; <strong>FAULTY</strong> &bull; <strong>MAINTENANCE</strong>.
                        </div>
                        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-96 overflow-y-auto">
                            {workstations.map(ws => (
                                <div 
                                    key={ws.workstation_id}
                                    className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col justify-between"
                                >
                                    <div className="flex items-center justify-between mb-1">
                                        <span className="font-bold text-xs text-slate-800">Station #{ws.station_number}</span>
                                        <span className="text-[10px] text-slate-400 font-mono">ID:{ws.workstation_id}</span>
                                    </div>
                                    <select
                                        value={ws.status}
                                        onChange={(e) => updateWsStatus(ws.workstation_id, e.target.value)}
                                        className={`mt-2 py-1 px-1.5 text-[11px] font-semibold rounded border cursor-pointer ${
                                            ws.status === 'ACTIVE' ? 'bg-emerald-50 text-emerald-700 border-emerald-300' :
                                            ws.status === 'FAULTY' ? 'bg-rose-50 text-rose-700 border-rose-300' :
                                            'bg-amber-50 text-amber-700 border-amber-300'
                                        }`}
                                    >
                                        <option value="ACTIVE">ACTIVE</option>
                                        <option value="FAULTY">FAULTY</option>
                                        <option value="MAINTENANCE">MAINTENANCE</option>
                                    </select>
                                </div>
                            ))}
                        </div>
                        <div className="flex justify-end pt-2">
                            <button
                                onClick={() => setSelectedLab(null)}
                                className="px-4 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold"
                            >
                                Close
                            </button>
                        </div>
                    </div>
                )}
            </Modal>

            {/* Confirm Delete */}
            <ConfirmDialog
                isOpen={!!deleteId}
                onClose={() => setDeleteId(null)}
                onConfirm={handleDelete}
                title="Delete Laboratory"
                message="Are you sure you want to delete this lab? Note: If this laboratory is scheduled in active master timetables, MySQL's ON DELETE RESTRICT constraint will reject the deletion to guarantee referential integrity!"
                confirmText="Confirm Delete"
                confirmVariant="danger"
                loading={deleting}
            />
        </div>
    );
}
