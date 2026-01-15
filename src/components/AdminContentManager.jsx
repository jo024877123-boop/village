// ContentManagement component for AdminPanel
// 이 파일을 AdminPanel.jsx의 settings 섹션 앞에 추가합니다

{
    activeTab === 'contents' && (
        <ContentsManager />
    )
}

// 별도 컴포넌트로 분리
function ContentsManager() {
    const { contents, loading } = useAllContents();
    const [editingContent, setEditingContent] = useState(null);
    const [isInitializing, setIsInitializing] = useState(false);
    const [saveMessage, setSaveMessage] = useState('');

    const handleInitialize = async () => {
        if (!confirm('초기 8개 컨텐츠 데이터를 생성하시겠습니까? (기존 데이터가 있으면 생성되지 않습니다)')) return;
        setIsInitializing(true);
        const result = await contentActions.initializeContents();
        setSaveMessage(result.message || result.error);
        setTimeout(() => setSaveMessage(''), 3000);
        setIsInitializing(false);
    };

    const handleSave = async (contentData) => {
        const result = editingContent?.id
            ? await contentActions.updateContent(editingContent.id, contentData)
            : await contentActions.addContent(contentData);

        if (result.success) {
            setSaveMessage('저장 완료!');
            setEditingContent(null);
        } else {
            setSaveMessage('저장 실패: ' + result.error);
        }
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const handleDelete = async (id) => {
        if (!confirm('정말 이 컨텐츠를 삭제하시겠습니까?')) return;
        const result = await contentActions.deleteContent(id);
        setSaveMessage(result.success ? '삭제 완료!' : '삭제 실패');
        setTimeout(() => setSaveMessage(''), 3000);
    };

    const moveContent = async (index, direction) => {
        const newOrder = [...contents];
        if (direction === 'up' && index > 0) {
            [newOrder[index], newOrder[index - 1]] = [newOrder[index - 1], newOrder[index]];
        } else if (direction === 'down' && index < newOrder.length - 1) {
            [newOrder[index], newOrder[index + 1]] = [newOrder[index + 1], newOrder[index]];
        }
        await contentActions.reorderContents(newOrder);
    };

    if (editingContent !== null) {
        return <ContentEditForm
            content={editingContent}
            onSave={handleSave}
            onCancel={() => setEditingContent(null)}
            saveMessage={saveMessage}
        />;
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-bold text-slate-800">컨텐츠 관리</h3>
                    <p className="text-sm text-slate-500 mt-1">사이트의 컨텐츠들을 추가, 수정, 삭제할 수 있습니다.</p>
                </div>
                <button
                    onClick={handleInitialize}
                    disabled={isInitializing || contents.length > 0}
                    className="px-4 py-2 bg-indigo-100 text-indigo-700 rounded-lg font-bold text-sm hover:bg-indigo-200 transition-all disabled:opacity-50"
                >
                    {isInitializing ? <Loader2 size={16} className="animate-spin inline mr-2" /> : null}
                    초기 데이터 생성
                </button>
            </div>

            {saveMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-bold text-sm animate-pulse">
                    {saveMessage}
                </div>
            )}

            {loading ? (
                <div className="flex items-center justify-center py-20">
                    <Loader2 className="animate-spin text-indigo-500" size={40} />
                </div>
            ) : contents.length === 0 ? (
                <div className="text-center py-20 bg-slate-50 rounded-xl border border-slate-200">
                    <FileText size={48} className="mx-auto text-slate-300 mb-4" />
                    <p className="text-slate-500">등록된 컨텐츠가 없습니다.</p>
                    <p className="text-sm text-slate-400 mt-2">위 버튼을 눌러 초기 데이터를 생성하세요.</p>
                </div>
            ) : (
                <>
                    {/* Contents List */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {contents.map((content, idx) => {
                            const ContentIcon = getIcon(content.icon);
                            return (
                                <div key={content.id} className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all">
                                    <div className="flex items-start gap-4">
                                        {/* Icon */}
                                        <div className={`w-12 h-12 rounded-lg bg-gradient-to-br ${content.color} flex items-center justify-center flex-shrink-0`}>
                                            <ContentIcon size={24} className="text-white" />
                                        </div>

                                        {/* Content */}
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h4 className="font-bold text-slate-800 truncate">{content.title}</h4>
                                                <span className="text-xs text-slate-400 px-2 py-0.5 bg-slate-100 rounded">#{content.order}</span>
                                                {!content.show && <EyeOff size={14} className="text-slate-400" />}
                                            </div>
                                            <p className="text-sm text-slate-500 truncate">{content.subtitle}</p>
                                            <p className="text-xs text-slate-400 mt-2">/{content.slug}</p>
                                        </div>

                                        {/* Actions */}
                                        <div className="flex flex-col gap-1">
                                            <button onClick={() => moveContent(idx, 'up')} disabled={idx === 0} className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-20">▲</button>
                                            <button onClick={() => moveContent(idx, 'down')} disabled={idx === contents.length - 1} className="p-1 hover:bg-slate-100 rounded text-slate-400 disabled:opacity-20">▼</button>
                                        </div>
                                    </div>

                                    {/* Footer Actions */}
                                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-slate-100">
                                        <button
                                            onClick={() => setEditingContent(content)}
                                            className="flex-1 px-3 py-2 bg-indigo-50 text-indigo-600 rounded-lg text-sm font-bold hover:bg-indigo-100 transition-all"
                                        >
                                            편집
                                        </button>
                                        <button
                                            onClick={async () => {
                                                const result = await contentActions.updateContent(content.id, { show: !content.show });
                                                setSaveMessage(result.success ? '노출 설정 변경!' : '실패');
                                                setTimeout(() => setSaveMessage(''), 2000);
                                            }}
                                            className={`px-3 py-2 rounded-lg text-sm font-bold transition-all ${content.show ? 'bg-slate-100 text-slate-600' : 'bg-yellow-50 text-yellow-600'}`}
                                        >
                                            {content.show ? <Eye size={16} /> : <EyeOff size={16} />}
                                        </button>
                                        <button
                                            onClick={() => handleDelete(content.id)}
                                            className="px-3 py-2 bg-slate-50 text-slate-400 rounded-lg hover:bg-rose-100 hover:text-rose-500 transition-all"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Add New */}
                    <button
                        onClick={() => setEditingContent({
                            slug: '',
                            title: '',
                            subtitle: '',
                            description: '',
                            order: contents.length + 1,
                            show: true,
                            icon: 'Star',
                            color: 'from-cyan-500 to-blue-600',
                            heroImage: '',
                            features: [],
                            howToJoin: '',
                            schedule: ''
                        })}
                        className="w-full py-4 border-2 border-dashed border-slate-300 rounded-xl text-slate-500 font-bold hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 transition-all flex items-center justify-center gap-2"
                    >
                        <Plus size={20} /> 새 컨텐츠 추가
                    </button>
                </>
            )}
        </div>
    );
}

// 컨텐츠 편집 폼 (너무 길어서 별도 작성 파일로 분리 필요)
function ContentEditForm({ content, onSave, onCancel, saveMessage }) {
    const [formData, setFormData] = useState(content);

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    const handleFeatureChange = (index, field, value) => {
        const newFeatures = [...formData.features];
        newFeatures[index] = { ...newFeatures[index], [field]: value };
        setFormData(prev => ({ ...prev, features: newFeatures }));
    };

    const addFeature = () => {
        setFormData(prev => ({
            ...prev,
            features: [...prev.features, { title: '', description: '', icon: 'Star' }]
        }));
    };

    const removeFeature = (index) => {
        setFormData(prev => ({
            ...prev,
            features: prev.features.filter((_, i) => i !== index)
        }));
    };

    return (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm space-y-6">
            {/* Header */}
            <div className="flex justify-between items-center pb-6 border-b border-slate-200">
                <h3 className="text-xl font-bold text-slate-800">
                    {content.id ? `편집: ${content.title}` : '새 컨텐츠 추가'}
                </h3>
                <button onClick={onCancel} className="text-slate-400 hover:text-slate-600">
                    <XCircle size={24} />
                </button>
            </div>

            {saveMessage && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg font-bold text-sm">
                    {saveMessage}
                </div>
            )}

            {/* Form */}
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">제목</label>
                    <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => handleChange('title', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">Slug (URL)</label>
                    <input
                        type="text"
                        value={formData.slug}
                        onChange={(e) => handleChange('slug', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none font-mono text-sm"
                        placeholder="club"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">부제목</label>
                <input
                    type="text"
                    value={formData.subtitle}
                    onChange={(e) => handleChange('subtitle', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">설명</label>
                <textarea
                    rows={4}
                    value={formData.description}
                    onChange={(e) => handleChange('description', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none resize-none"
                />
            </div>

            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">아이콘</label>
                    <select
                        value={formData.icon}
                        onChange={(e) => handleChange('icon', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                    >
                        {Object.keys(ICON_MAP).map(key => <option key={key} value={key}>{key}</option>)}
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">순서</label>
                    <input
                        type="number"
                        value={formData.order}
                        onChange={(e) => handleChange('order', parseInt(e.target.value))}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none"
                    />
                </div>
                <div className="flex items-end">
                    <label className="flex items-center gap-2 cursor-pointer">
                        <input
                            type="checkbox"
                            checked={formData.show}
                            onChange={(e) => handleChange('show', e.target.checked)}
                            className="w-5 h-5 accent-indigo-600"
                        />
                        <span className="text-sm font-bold text-slate-700">노출</span>
                    </label>
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-slate-700 mb-2">색상 (Tailwind Gradient)</label>
                <input
                    type="text"
                    value={formData.color}
                    onChange={(e) => handleChange('color', e.target.value)}
                    className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none font-mono text-sm"
                    placeholder="from-cyan-500 to-blue-600"
                />
            </div>

            {/* 특징 목록 */}
            <div>
                <div className="flex justify-between items-center mb-3">
                    <label className="block text-sm font-bold text-slate-700">주요 특징</label>
                    <button onClick={addFeature} className="px-3 py-1 bg-indigo-50 text-indigo-600 rounded text-xs font-bold hover:bg-indigo-100">
                        <Plus size={14} className="inline mr-1" />특징 추가
                    </button>
                </div>
                <div className="space-y-3">
                    {formData.features?.map((feature, idx) => (
                        <div key={idx} className="flex gap-2 items-start p-3 bg-slate-50 rounded-lg">
                            <div className="flex-1 grid grid-cols-3 gap-2">
                                <input
                                    type="text"
                                    value={feature.title}
                                    onChange={(e) => handleFeatureChange(idx, 'title', e.target.value)}
                                    placeholder="제목"
                                    className="px-3 py-2 rounded border border-slate-200 text-sm"
                                />
                                <input
                                    type="text"
                                    value={feature.description}
                                    onChange={(e) => handleFeatureChange(idx, 'description', e.target.value)}
                                    placeholder="설명"
                                    className="px-3 py-2 rounded border border-slate-200 text-sm"
                                />
                                <select
                                    value={feature.icon}
                                    onChange={(e) => handleFeatureChange(idx, 'icon', e.target.value)}
                                    className="px-3 py-2 rounded border border-slate-200 text-sm"
                                >
                                    {Object.keys(ICON_MAP).slice(0, 20).map(key => <option key={key} value={key}>{key}</option>)}
                                </select>
                            </div>
                            <button onClick={() => removeFeature(idx)} className="p-2 text-slate-400 hover:text-rose-500">
                                <Trash2 size={16} />
                            </button>
                        </div>
                    ))}
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">참여 방법</label>
                    <textarea
                        rows={3}
                        value={formData.howToJoin}
                        onChange={(e) => handleChange('howToJoin', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none resize-none"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2">일정</label>
                    <textarea
                        rows={3}
                        value={formData.schedule}
                        onChange={(e) => handleChange('schedule', e.target.value)}
                        className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:border-indigo-500 outline-none resize-none"
                    />
                </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 pt-6 border-t border-slate-200">
                <button
                    onClick={() => onSave(formData)}
                    className="flex-1 px-6 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-all"
                >
                    저장하기
                </button>
                <button
                    onClick={onCancel}
                    className="px-6 py-3 bg-slate-100 text-slate-600 font-bold rounded-lg hover:bg-slate-200 transition-all"
                >
                    취소
                </button>
            </div>
        </div>
    );
}
