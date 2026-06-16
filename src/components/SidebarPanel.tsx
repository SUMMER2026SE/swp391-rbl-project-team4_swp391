"use client";
import React, { useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';

export default function SidebarPanel({
  panel, onClose, onAvatarUpdated, dark, userName, navAvatarUrl, dashStreak, skills,
  inkColor, ink2Color, headerBg, panelBorder, contentBg, titleColor, nightCardBg, nightCardBorder
}: any) {
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string>('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const stars = React.useMemo(() =>
    Array.from({length: 14}, (_, i) => ({
      top: `${(5 + Math.random() * 80).toFixed(1)}%`,
      left: `${(4 + Math.random() * 92).toFixed(1)}%`,
      w: `${(i%4===0 ? 13+Math.random()*7 : 6+Math.random()*7).toFixed(1)}px`,
    }))
  , []);

  const title = panel === 'profile' ? 'Hồ sơ cá nhân' : panel === 'avatar' ? 'Đổi ảnh đại diện' : 'Đổi mật khẩu';

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const f = e.target.files[0];
      setFile(f);
      setPreview(URL.createObjectURL(f));
    }
  };

  const handleUploadAvatar = async () => {
    if (!file) return;
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      const { data: { session } } = await supabase.auth.getSession();
      const user = session?.user;
      if (!user) { setError('Vui lòng đăng nhập lại.'); setLoading(false); return; }

      const ext = file.name.split('.').pop();
      const path = `avatars/${user.id}.${ext}`;
      const { error: upErr } = await supabase.storage.from('avatars').upload(path, file, { upsert: true });
      if (upErr) { setError(upErr.message); setLoading(false); return; }

      const { data: { publicUrl } } = supabase.storage.from('avatars').getPublicUrl(path);
      await supabase.auth.updateUser({ data: { avatar_url: publicUrl } });
      
      setSuccess('Đã đổi ảnh đại diện thành công!');
      if (onAvatarUpdated) onAvatarUpdated(publicUrl);
      setTimeout(onClose, 1500);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  const handleChangePassword = async () => {
    setError('');
    setSuccess('');
    if (newPassword !== confirmPassword) { setError('Mật khẩu không khớp'); return; }
    if (newPassword.length < 8) { setError('Mật khẩu phải có ít nhất 8 ký tự'); return; }
    
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) { setError(error.message); setLoading(false); return; }
      setSuccess('Đã đổi mật khẩu thành công');
      setTimeout(onClose, 2000);
    } catch (e: any) {
      setError(e.message);
    }
    setLoading(false);
  };

  return (
    <div style={{
      position: 'fixed', inset: '0', zIndex: '200',
      display: 'flex', alignItems: 'stretch', justifyContent: 'flex-end'
    }}>
      {/* backdrop */}
      <div onClick={onClose} style={{
        position: 'absolute', inset: '0',
        background: dark ? 'rgba(0,0,0,.55)' : 'rgba(30,38,14,.35)',
        backdropFilter: 'blur(3px)'
      }} />
      
      {/* panel */}
      <div style={{
        position: 'relative', zIndex: '1',
        width: '420px', maxWidth: '95vw', height: '100%',
        background: dark ? '#1B1E13' : '#FFF8EB',
        borderLeft: `1px solid ${panelBorder}`,
        display: 'flex', flexDirection: 'column',
        animation: 'panelSlideIn .28s cubic-bezier(.22,.68,0,1.2) both',
        overflowY: 'auto'
      }}>
        {/* star field — same as cardStars */}
        <div aria-hidden style={{ position: 'absolute', inset: '0', pointerEvents: 'none', overflow: 'hidden' }}>
          {stars.map((s, i) => (
            <svg key={i} viewBox="0 0 24 24" style={{ position:'absolute', top:s.top, left:s.left, width:s.w, height:s.w, opacity:0.15 }}>
              <path d="M12 0C12.7 6.4 17.6 11.3 24 12 17.6 12.7 12.7 17.6 12 24 11.3 17.6 6.4 12.7 0 12 6.4 11.3 11.3 6.4 12 0Z" fill={inkColor} />
            </svg>
          ))}
        </div>

        {/* header */}
        <div style={{ padding: '22px 24px 0', display: 'flex', alignItems: 'center', gap: '12px', borderBottom: `1px solid ${panelBorder}`, paddingBottom: '16px', position: 'relative', zIndex: 2 }}>
          <button onClick={onClose} style={{ background:'none', border:'none', cursor:'pointer', color: ink2Color, padding: '4px' }}>
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="19" y1="12" x2="5" y2="12"></line><polyline points="12 19 5 12 12 5"></polyline></svg>
          </button>
          <span style={{ fontFamily:"'Nunito'", fontWeight:'900', fontSize:'18px', color: inkColor }}>
            {title}
          </span>
          <svg style={{ marginLeft:'auto', opacity:'.35' }} width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={inkColor} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
        </div>

        {/* content */}
        <div style={{ padding: '24px', flex: '1', display: 'flex', flexDirection: 'column', gap: '20px', position: 'relative', zIndex: 2 }}>
          {panel === 'profile' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '24px' }}>
              <div style={{ width: '90px', height: '90px', borderRadius: '50%', background: '#5D6B2D', color: '#FFF8EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito'", fontWeight: '900', fontSize: '36px', overflow: 'hidden', border: `4px solid ${contentBg}`, boxShadow: `0 0 0 1px ${panelBorder}` }}>
                {navAvatarUrl ? <img src={navAvatarUrl} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (userName || 'HV').split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontFamily: "'Nunito'", fontWeight: '900', fontSize: '24px', color: inkColor }}>{userName}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#FFF3D6', border: '1px solid #F6C453', borderRadius: '12px', padding: '4px 10px', marginTop: '8px' }}>
                  <span>🔥</span>
                  <span style={{ fontFamily: "'Nunito'", fontWeight: '900', fontSize: '14px', color: '#9a5a14' }}>{dashStreak} ngày chuỗi học</span>
                </div>
              </div>

              <div style={{ width: '100%', background: dark ? '#242A18' : '#F4F0E1', borderRadius: '16px', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', border: `1px solid ${panelBorder}` }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: titleColor }}>READING</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: "'Nunito'", fontWeight: '900', fontSize: '18px', color: '#5D6B2D' }}>{skills?.reading ?? '--'}</span>
                    <div style={{ height: '6px', flex: 1, background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: skills?.reading ? `${(skills.reading/9)*100}%` : '0%', height: '100%', background: '#5D6B2D' }}></div></div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: titleColor }}>WRITING</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: "'Nunito'", fontWeight: '900', fontSize: '18px', color: '#C2693B' }}>{skills?.writing ?? '--'}</span>
                    <div style={{ height: '6px', flex: 1, background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: skills?.writing ? `${(skills.writing/9)*100}%` : '0%', height: '100%', background: '#C2693B' }}></div></div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: titleColor }}>LISTENING</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: "'Nunito'", fontWeight: '900', fontSize: '18px', color: '#E0A52E' }}>{skills?.listening ?? '--'}</span>
                    <div style={{ height: '6px', flex: 1, background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: skills?.listening ? `${(skills.listening/9)*100}%` : '0%', height: '100%', background: '#E0A52E' }}></div></div>
                  </div>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <span style={{ fontSize: '13px', fontWeight: '800', color: titleColor }}>SPEAKING</span>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span style={{ fontFamily: "'Nunito'", fontWeight: '900', fontSize: '18px', color: '#8AA04A' }}>{skills?.speaking ?? '--'}</span>
                    <div style={{ height: '6px', flex: 1, background: 'rgba(0,0,0,0.06)', borderRadius: '3px', overflow: 'hidden' }}><div style={{ width: skills?.speaking ? `${(skills.speaking/9)*100}%` : '0%', height: '100%', background: '#8AA04A' }}></div></div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {panel === 'avatar' && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px' }}>
              <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#5D6B2D', color: '#FFF8EB', display: 'flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Nunito'", fontWeight: '900', fontSize: '32px', overflow: 'hidden', border: `3px solid ${contentBg}`, boxShadow: `0 0 0 1px ${panelBorder}` }}>
                {preview ? <img src={preview} alt="Preview" style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : navAvatarUrl ? <img src={navAvatarUrl} alt={userName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} /> : (userName || 'HV').split(' ').map((w: string) => w[0]).join('').substring(0, 2).toUpperCase()}
              </div>
              <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} style={{ display: 'none' }} />
              <button onClick={() => fileInputRef.current?.click()} style={{ background: '#F4F0E1', border: `1px solid ${panelBorder}`, borderRadius: '12px', padding: '10px 16px', color: '#2A3114', fontWeight: '700', fontSize: '14px', cursor: 'pointer' }}>Chọn ảnh</button>
              
              {error && <div style={{ background: '#F7E7DE', border: '1px solid #D8A78C', color: '#b9694a', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', width: '100%', textAlign: 'center', opacity: 1, transition: 'opacity .3s' }}>{error}</div>}
              {success && <div style={{ background: '#E7F0DD', border: '1px solid #9DB87E', color: '#5D6B2D', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', width: '100%', textAlign: 'center', opacity: 1, transition: 'opacity .3s' }}>{success}</div>}

              <div style={{ display: 'flex', gap: '12px', width: '100%', marginTop: 'auto', paddingTop: '20px' }}>
                <button onClick={onClose} style={{ flex: 1, background: 'transparent', border: `1px solid ${panelBorder}`, borderRadius: '14px', padding: '12px', color: inkColor, fontWeight: '700', fontSize: '15px', cursor: 'pointer' }}>Hủy</button>
                <button onClick={handleUploadAvatar} disabled={loading || !file} style={{ flex: 1, background: '#5D6B2D', border: 'none', borderRadius: '14px', padding: '12px', color: '#FFF8EB', fontWeight: '800', fontSize: '15px', cursor: (loading || !file) ? 'not-allowed' : 'pointer', opacity: (loading || !file) ? 0.6 : 1 }}>Lưu</button>
              </div>
            </div>
          )}

          {panel === 'password' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <input type="password" placeholder="Mật khẩu mới" value={newPassword} onChange={e => setNewPassword(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: dark ? '#242A18' : '#F4F0E1', border: `1px solid ${panelBorder}`, borderRadius: '14px', color: inkColor, fontSize: '14px', fontFamily: 'inherit', outline: 'none' }} />
              <input type="password" placeholder="Xác nhận mật khẩu" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} style={{ width: '100%', padding: '12px 16px', background: dark ? '#242A18' : '#F4F0E1', border: `1px solid ${panelBorder}`, borderRadius: '14px', color: inkColor, fontSize: '14px', fontFamily: 'inherit', outline: 'none' }} />
              
              {error && <div style={{ background: '#F7E7DE', border: '1px solid #D8A78C', color: '#b9694a', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', width: '100%', textAlign: 'center', opacity: 1, transition: 'opacity .3s' }}>{error}</div>}
              {success && <div style={{ background: '#E7F0DD', border: '1px solid #9DB87E', color: '#5D6B2D', padding: '10px 14px', borderRadius: '12px', fontSize: '13px', width: '100%', textAlign: 'center', opacity: 1, transition: 'opacity .3s' }}>{success}</div>}

              <button onClick={handleChangePassword} disabled={loading} style={{ background: '#5D6B2D', border: 'none', borderRadius: '14px', padding: '12px', color: '#FFF8EB', fontWeight: '800', fontSize: '15px', cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.6 : 1, marginTop: '8px' }}>Đổi mật khẩu</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
