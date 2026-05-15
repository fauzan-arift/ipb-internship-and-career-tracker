import React, { useState } from 'react';
import { Send } from 'lucide-react';
import CandidateInfoCard from '../molecules/CandidateInfoCard';
import FormSectionCard from './FormSectionCard';
import InfoSectionCard from './InfoSectionCard';
import FormGrid2Col from '../molecules/FormGrid2Col';
import FormActionBar from '../molecules/FormActionBar';
import TextInput from '../atoms/TextInput';
import TextArea from '../atoms/TextArea';
import DatePicker from '../atoms/DatePicker';
import UploadZone from '../atoms/UploadZone';
import UploadedFileRow from '../molecules/UploadedFileRow';
import { FileText } from 'lucide-react';

function OfferingForm({ candidate, onCancel, onSubmit }) {
  const [offeringDate, setOfferingDate] = useState(null);
  const [duration, setDuration] = useState('');
  const [compensation, setCompensation] = useState('');
  const [deadline, setDeadline] = useState(null);
  const [message, setMessage] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  function onFileUpload(file) {
    setUploadedFile(file);
  }

  function onDeleteFile() {
    setUploadedFile(null);
  }

  function onSubmitHandler() {
    onSubmit({
      offeringDate,
      duration,
      compensation,
      deadline,
      message,
      file: uploadedFile,
    });
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
      <CandidateInfoCard
        name={candidate.name}
        major={candidate.major}
        faculty={candidate.faculty}
        logoInitials={candidate.logoInitials}
        logoColor={candidate.logoColor}
      />

      <FormSectionCard title="Detail Penawaran">
        <FormGrid2Col>
          <DatePicker
            label="Tanggal Penawaran"
            placeholder="dd/mm/yyyy"
            value={offeringDate}
            onChange={setOfferingDate}
          />
          <TextInput
            label="Durasi Posisi"
            placeholder="Contoh: 3 bulan"
            value={duration}
            onChange={(e) => setDuration(e.target.value)}
          />
        </FormGrid2Col>
        <FormGrid2Col>
          <TextInput
            label="Uang Saku / Kompensasi"
            placeholder="Contoh: Rp 1.500.000/bulan"
            value={compensation}
            onChange={(e) => setCompensation(e.target.value)}
          />
          <DatePicker
            label="Tenggat Offering"
            placeholder="dd/mm/yyyy"
            value={deadline}
            onChange={setDeadline}
          />
        </FormGrid2Col>
        <TextArea
          label="Detail / Pesan Penawaran"
          placeholder="Tuliskan detail penawaran magang, termasuk deskripsi pekerjaan, fasilitas, ekspektasi, dan informasi lainnya yang relevan untuk kandidat..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
        />
      </FormSectionCard>

      <InfoSectionCard title="Dokumen" icon={<FileText size={18} />}>
        {uploadedFile ? (
          <UploadedFileRow
            fileName={uploadedFile.name}
            fileSize={`${(uploadedFile.size / 1024).toFixed(1)} KB`}
            onDelete={onDeleteFile}
          />
        ) : (
          <UploadZone
            hint="Format PDF, DOC, atau DOCX. Maksimal 5MB."
            accept=".pdf,.doc,.docx"
            onChange={onFileUpload}
          />
        )}
      </InfoSectionCard>

      <FormActionBar
        onCancel={onCancel}
        onSubmit={onSubmitHandler}
        cancelLabel="Batal"
        submitLabel="Kirim Penawaran"
        submitIcon={<Send size={15} />}
      />
    </div>
  );
}

export default OfferingForm;