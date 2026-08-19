
const { useState, useEffect } = React;

function App() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [adminCode, setAdminCode] = useState('Pétanque11150');
  
  // Données
  const [actualites, setActualites] = useState([
    { id: 1, titre: 'Concours d’ouverture de saison', date: '2026-03-15', desc: 'Beau succès pour notre premier concours de l’année avec plus de 40 équipes présentes.', cat: 'Concours' },
    { id: 2, titre: 'Assemblée Générale', date: '2026-02-10', desc: 'Merci à tous les membres présents lors de notre AG annuelle.', cat: 'Vie du club' }
  ]);

  const [concours, setConcours] = useState([
    { id: 1, titre: 'Grand Prix de Pexiora (Doublette)', date: '2026-07-14', lieu: 'Boulodrome municipal', heure: '14h30', prix: '150€ + mises' },
    { id: 2, titre: 'Concours Nocturne (Triplette)', date: '2026-08-15', lieu: 'Boulodrome municipal', heure: '20h00', prix: 'Mises + Coupes' }
  ]);
  
  const [tarifs, setTarifs] = useState({
    licenceAdulte: '45 €',
    licenceJeune: '20 €',
    concoursInscription: '5 € / joueur',
    repasAdulte: '15 €',
    repasEnfant: '8 €'
  });

  const [clubInfo, setClubInfo] = useState({
    nom: 'Union Bouliste de Pexiora',
    adresse: 'Terrain de pétanque municipal, 11150 Pexiora',
    horaires: 'Ouvert tous les jours de 14h à 20h',
    contact: 'contact@ubp-pexiora.fr'
  });

  // États pour les formulaires d'ajout
  const [newActu, setNewActu] = useState({ titre: '', date: '', desc: '', cat: 'Actualité' });
  const [newConcours, setNewConcours] = useState({ titre: '', date: '', lieu: 'Boulodrome municipal', heure: '14h00', prix: '' });

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminCode) {
      setIsAdmin(true);
      setPasswordInput('');
    } else {
      alert('Mot de passe incorrect.');
    }
  };

  // Fonctions de gestion CRUD
  const ajouterActualite = (e) => {
    e.preventDefault();
    setActualites([{ ...newActu, id: Date.now() }, ...actualites]);
    setNewActu({ titre: '', date: '', desc: '', cat: 'Actualité' });
  };

  const supprimerActualite = (id) => {
    if(window.confirm('Supprimer cette actualité ?')) {
      setActualites(actualites.filter(a => a.id !== id));
    }
  };

  const ajouterConcours = (e) => {
    e.preventDefault();
    setConcours([...concours, { ...newConcours, id: Date.now() }].sort((a,b) => new Date(a.date) - new Date(b.date)));
    setNewConcours({ titre: '', date: '', lieu: 'Boulodrome municipal', heure: '14h00', prix: '' });
  };

  const supprimerConcours = (id) => {
    if(window.confirm('Supprimer ce concours ?')) {
      setConcours(concours.filter(c => c.id !== id));
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* En-tête & Navigation */}
      <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('accueil')}>
            <img 
                src="logo.jpg" 
                alt="Logo UBP" 
                className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 bg-white shadow-md group-hover:scale-105 transition-transform"
                onError={(e) => { 
                    e.target.style.display = 'none';
                    document.getElementById('fallback-logo').style.display = 'flex';
                }} 
            />
            <div id="fallback-logo" style={{display: 'none'}} className="w-14 h-14 rounded-full bg-amber-400 items-center justify-center font-bold text-emerald-950 overflow-hidden border-2 border-amber-300 shadow-md">
              <span className="text-sm">UBP</span>
            </div>
            <div>
              <h1 className="font-extrabold text-xl tracking-wide text-white group-hover:text-amber-300 transition-colors">{clubInfo.nom}</h1>
              <p className="text-sm text-emerald-200"><i className="fa-solid fa-location-dot mr-1"></i> Aude (11150)</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 mt-4 md:mt-0 text-sm font-semibold">
            {[
              { id: 'accueil', icon: 'fa-house', label: 'Accueil' },
              { id: 'actualites', icon: 'fa-newspaper', label: 'Actualités' },
              { id: 'concours', icon: 'fa-trophy', label: 'Concours' },
              { id: 'tarifs', icon: 'fa-coins', label: 'Tarifs' },
              { id: 'club', icon: 'fa-users', label: 'Le Club' }
            ].map(tab => (
              <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)} 
                className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id ? 'bg-amber-400 text-emerald-950 shadow-md' : 'hover:bg-emerald-800 text-emerald-50'}`}
              >
                <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        
        {/* ONGLET ACCUEIL */}
        {activeTab === 'accueil' && (
          <div className="space-y-12 animate-fade-in">
            {/* Hero Section */}
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-10 md:p-20 shadow-2xl flex flex-col items-center text-center border-b-4 border-amber-400">
              <div className="absolute inset-0 opacity-10 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 drop-shadow-lg">
                Bienvenue au Club de Pétanque !
              </h2>
              <p className="text-xl text-emerald-100 max-w-3xl mb-10 leading-relaxed">
                Convivialité, passion et sport local au cœur de l'Aude. Rejoignez l'UBP pour partager de superbes parties de boules à Pexiora !
              </p>
              <div className="flex gap-4 flex-wrap justify-center relative z-10">
                <button onClick={() => setActiveTab('concours')} className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-8 py-4 rounded-xl shadow-[0_0_15px_rgba(245,158,11,0.5)] hover:shadow-[0_0_25px_rgba(245,158,11,0.7)] transition-all transform hover:-translate-y-1 text-lg">
                  <i className="fa-solid fa-calendar-check mr-2"></i> Prochains événements
                </button>
                <button onClick={() => setActiveTab('club')} className="bg-emerald-800/80 backdrop-blur hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-emerald-600 hover:border-emerald-400 text-lg">
                  <i className="fa-solid fa-circle-info mr-2"></i> Découvrir le club
                </button>
              </div>
            </div>

            {/* Aperçu rapide */}
            <div className="grid md:grid-cols-2 gap-8">
              {/* Dernières actus */}
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-50 rounded-bl-full -z-10"></div>
                <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
                  <i className="fa-regular fa-newspaper text-amber-500"></i> À la une
                </h3>
                <div className="space-y-4">
                  {actualites.slice(0, 3).map(actu => (
                    <div key={actu.id} className="border-l-4 border-amber-400 pl-4 py-2 bg-slate-50 rounded-r-lg hover:bg-slate-100 transition">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{actu.cat}</span>
                      <h4 className="font-bold text-lg text-slate-800 leading-tight mt-1">{actu.titre}</h4>
                      <p className="text-sm text-slate-500 mb-1"><i className="fa-regular fa-clock mr-1"></i> {actu.date}</p>
                    </div>
                  ))}
                </div>
                <button onClick={() => setActiveTab('actualites')} className="mt-6 text-emerald-700 font-bold hover:text-emerald-900 text-sm">Voir toutes les actualités &rarr;</button>
              </div>

              {/* Prochain concours */}
              <div className="bg-emerald-900 rounded-2xl shadow-lg p-8 text-white relative overflow-hidden border border-emerald-800">
                <div className="absolute top-0 right-0 w-32 h-32 bg-emerald-800 rounded-bl-full -z-10"></div>
                <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-3">
                  <i className="fa-solid fa-trophy"></i> Prochain Concours
                </h3>
                {concours.length > 0 ? (
                  <div className="bg-emerald-950/50 p-6 rounded-xl border border-emerald-800/50 backdrop-blur-sm">
                    <h4 className="text-xl font-bold text-white mb-2">{concours[0].titre}</h4>
                    <ul className="space-y-3 mt-4 text-emerald-100">
                      <li className="flex items-center gap-3"><i className="fa-regular fa-calendar text-amber-400 w-5"></i> {concours[0].date}</li>
                      <li className="flex items-center gap-3"><i className="fa-regular fa-clock text-amber-400 w-5"></i> Jet du but : {concours[0].heure}</li>
                      <li className="flex items-center gap-3"><i className="fa-solid fa-location-dot text-amber-400 w-5"></i> {concours[0].lieu}</li>
                      <li className="flex items-center gap-3"><i className="fa-solid fa-gift text-amber-400 w-5"></i> {concours[0].prix}</li>
                    </ul>
                  </div>
                ) : (
                  <p className="text-emerald-200 italic">Aucun concours programmé pour le moment.</p>
                )}
                <button onClick={() => setActiveTab('concours')} className="mt-6 text-amber-400 font-bold hover:text-amber-300 text-sm">Voir le calendrier complet &rarr;</button>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET ACTUALITÉS */}
        {activeTab === 'actualites' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-2 border-b-4 border-amber-400 inline-block pb-2">Actualités du Club</h2>
            <p className="text-slate-500 mb-8 mt-4">Restez informé de la vie de l'Union Bouliste de Pexiora.</p>
            <div className="space-y-6">
              {actualites.length === 0 ? (
                 <p className="text-center text-slate-500 py-10">Aucune actualité pour le moment.</p>
              ) : (
                actualites.map(actu => (
                  <div key={actu.id} className="bg-white p-6 md:p-8 rounded-2xl shadow-sm border border-slate-200 hover:shadow-md transition">
                    <div className="flex flex-wrap justify-between items-start mb-4 gap-2">
                      <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full font-bold uppercase tracking-wide">{actu.cat}</span>
                      <span className="text-sm text-slate-400 font-medium"><i className="fa-regular fa-calendar mr-1"></i> {actu.date}</span>
                    </div>
                    <h3 className="text-2xl font-bold text-slate-800 mb-3">{actu.titre}</h3>
                    <p className="text-slate-600 leading-relaxed">{actu.desc}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ONGLET CONCOURS */}
        {activeTab === 'concours' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-2 border-b-4 border-amber-400 inline-block pb-2">Calendrier des Concours</h2>
            <p className="text-slate-500 mb-8 mt-4">Préparez vos boules et venez participer à nos tournois !</p>
            <div className="grid gap-6">
              {concours.length === 0 ? (
                <p className="text-center text-slate-500 py-10">Aucun concours programmé.</p>
              ) : (
                concours.map((c, index) => (
                  <div key={c.id} className="flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden hover:shadow-md transition">
                    <div className="bg-emerald-900 text-white p-6 md:w-48 flex flex-col justify-center items-center text-center border-b md:border-b-0 md:border-r border-emerald-800">
                      <i className="fa-solid fa-trophy text-3xl text-amber-400 mb-2"></i>
                      <span className="font-bold text-lg">{c.date.split('-').reverse().join('/')}</span>
                      <span className="text-emerald-300 text-sm mt-1">{c.heure}</span>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{c.titre}</h3>
                      <div className="text-sm text-slate-600 space-y-1 mt-2">
                        <p><i className="fa-solid fa-location-dot text-emerald-600 w-5"></i> {c.lieu}</p>
                        <p><i className="fa-solid fa-gift text-emerald-600 w-5"></i> Dotation : <span className="font-semibold">{c.prix}</span></p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        )}

        {/* ONGLET TARIFS */}
        {activeTab === 'tarifs' && (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-2 border-b-4 border-amber-400 inline-block pb-2">Tarifs & Adhésions</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              {/* Licences */}
              <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden flex flex-col">
                <div className="bg-emerald-900 p-4 text-center">
                  <i className="fa-solid fa-id-card text-3xl text-amber-400 mb-2"></i>
                  <h3 className="font-bold text-xl text-white">Licences Annuelles</h3>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-center gap-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-600 font-medium">Adulte</span>
                    <span className="font-bold text-2xl text-emerald-800">{tarifs.licenceAdulte}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Jeune (-18 ans)</span>
                    <span className="font-bold text-2xl text-emerald-800">{tarifs.licenceJeune}</span>
                  </div>
                </div>
              </div>

              {/* Concours */}
              <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden flex flex-col">
                <div className="bg-emerald-900 p-4 text-center">
                  <i className="fa-solid fa-medal text-3xl text-amber-400 mb-2"></i>
                  <h3 className="font-bold text-xl text-white">Inscriptions Concours</h3>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-center text-center">
                  <span className="text-slate-500 mb-2">Tarif unique par joueur</span>
                  <span className="font-black text-4xl text-amber-500">{tarifs.concoursInscription}</span>
                </div>
              </div>

              {/* Repas */}
              <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden flex flex-col">
                <div className="bg-emerald-900 p-4 text-center">
                  <i className="fa-solid fa-utensils text-3xl text-amber-400 mb-2"></i>
                  <h3 className="font-bold text-xl text-white">Repas du Club</h3>
                </div>
                <div className="p-6 flex-grow flex flex-col justify-center gap-4">
                  <div className="flex justify-between items-center border-b border-slate-100 pb-2">
                    <span className="text-slate-600 font-medium">Menu Adulte</span>
                    <span className="font-bold text-2xl text-emerald-800">{tarifs.repasAdulte}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-slate-600 font-medium">Menu Enfant</span>
                    <span className="font-bold text-2xl text-emerald-800">{tarifs.repasEnfant}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET LE CLUB */}
        {activeTab === 'club' && (
          <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-2 border-b-4 border-amber-400 inline-block pb-2">À propos du club</h2>
            
            <div className="bg-white p-8 rounded-2xl shadow border border-slate-200">
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                Situé au cœur de Pexiora dans l'Aude, l'<strong>Union Bouliste de Pexiora (UBP)</strong> rassemble les passionnés de pétanque dans une ambiance conviviale, familiale et sportive. Que vous soyez tireur d'élite, pointeur précis ou simple amateur de bonnes soirées entre amis, notre boulodrome est fait pour vous !
              </p>
              
              <div className="grid md:grid-cols-2 gap-6 bg-slate-50 p-6 rounded-xl border border-slate-100">
                <div>
                  <h4 className="font-bold text-emerald-900 mb-4 flex items-center gap-2"><i className="fa-solid fa-circle-info text-amber-500"></i> Informations pratiques</h4>
                  <ul className="space-y-3">
                    <li className="flex items-start gap-3">
                      <i className="fa-solid fa-location-dot mt-1 text-emerald-600"></i>
                      <span className="text-sm text-slate-700">{clubInfo.adresse}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <i className="fa-solid fa-clock mt-1 text-emerald-600"></i>
                      <span className="text-sm text-slate-700">{clubInfo.horaires}</span>
                    </li>
                    <li className="flex items-start gap-3">
                      <i className="fa-solid fa-envelope mt-1 text-emerald-600"></i>
                      <a href={`mailto:${clubInfo.contact}`} className="text-sm text-emerald-700 hover:underline">{clubInfo.contact}</a>
                    </li>
                  </ul>
                </div>
                <div className="flex items-center justify-center">
                   {/* Carte simplifiée illustrative */}
                   <div className="w-full h-full min-h-[150px] bg-emerald-100 rounded-lg border-2 border-emerald-200 flex flex-col items-center justify-center text-emerald-800">
                      <i className="fa-solid fa-map-location-dot text-4xl mb-2 opacity-50"></i>
                      <span className="font-bold text-sm">Boulodrome de Pexiora</span>
                   </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ONGLET ADMIN */}
        {activeTab === 'admin' && (
          <div className="max-w-3xl mx-auto animate-fade-in">
            {!isAdmin ? (
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md mx-auto">
                <div className="w-20 h-20 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <i className="fa-solid fa-lock text-3xl text-emerald-800"></i>
                </div>
                <h2 className="text-2xl font-extrabold text-emerald-900 mb-2">Espace Dirigeants</h2>
                <p className="text-slate-500 mb-8 text-sm">Veuillez vous identifier pour gérer le site.</p>
                <form onSubmit={handleLogin} className="space-y-5 text-left">
                  <div>
                    <input 
                      type="password" 
                      value={passwordInput} 
                      onChange={(e) => setPasswordInput(e.target.value)} 
                      className="w-full border-2 border-slate-200 rounded-xl p-4 focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/20 outline-none transition font-mono text-center" 
                      placeholder="Mot de passe..."
                    />
                  </div>
                  <button type="submit" className="w-full bg-emerald-900 hover:bg-emerald-800 text-amber-300 font-bold p-4 rounded-xl transition shadow-lg hover:shadow-xl transform hover:-translate-y-0.5">
                    Déverrouiller <i className="fa-solid fa-arrow-right ml-2"></i>
                  </button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex flex-wrap justify-between items-center bg-emerald-900 text-white p-6 rounded-2xl shadow-lg">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-amber-400 rounded-full flex items-center justify-center text-emerald-950">
                      <i className="fa-solid fa-user-shield text-xl"></i>
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold">Panneau d'Administration</h2>
                      <p className="text-emerald-200 text-sm">Connecté en tant que gestionnaire</p>
                    </div>
                  </div>
                  <button onClick={() => setIsAdmin(false)} className="bg-red-500 hover:bg-red-600 text-white px-5 py-2 rounded-lg text-sm font-bold transition shadow">
                    <i className="fa-solid fa-power-off mr-2"></i> Déconnexion
                  </button>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* AJOUTER ACTUALITE */}
                  <div className="bg-white p-6 rounded-2xl shadow border border-slate-200">
                    <h3 className="font-bold text-emerald-900 text-lg mb-4 flex items-center gap-2 border-b pb-2"><i className="fa-solid fa-plus-circle text-amber-500"></i> Publier une actualité</h3>
                    <form onSubmit={ajouterActualite} className="space-y-4">
                      <input required type="text" placeholder="Titre de l'actualité" value={newActu.titre} onChange={e=>setNewActu({...newActu, titre: e.target.value})} className="w-full border border-slate-300 p-3 rounded-lg bg-slate-50 focus:bg-white outline-none focus:border-emerald-500" />
                      <div className="flex gap-4">
                        <input required type="date" value={newActu.date} onChange={e=>setNewActu({...newActu, date: e.target.value})} className="w-1/2 border border-slate-300 p-3 rounded-lg bg-slate-50 outline-none" />
                        <select value={newActu.cat} onChange={e=>setNewActu({...newActu, cat: e.target.value})} className="w-1/2 border border-slate-300 p-3 rounded-lg bg-slate-50 outline-none">
                          <option>Actualité</option>
                          <option>Résultats</option>
                          <option>Vie du club</option>
                        </select>
                      </div>
                      <textarea required placeholder="Texte de l'actualité..." value={newActu.desc} onChange={e=>setNewActu({...newActu, desc: e.target.value})} className="w-full border border-slate-300 p-3 rounded-lg bg-slate-50 h-24 outline-none focus:bg-white focus:border-emerald-500"></textarea>
                      <button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold py-3 rounded-lg transition">Ajouter l'actualité</button>
                    </form>

                    <div className="mt-6 max-h-48 overflow-y-auto space-y-2 pr-2">
                      {actualites.map(a => (
                        <div key={a.id} className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-200 text-sm">
                          <span className="font-semibold truncate pr-2">{a.titre}</span>
                          <button onClick={() => supprimerActualite(a.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition"><i className="fa-solid fa-trash"></i></button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* AJOUTER CONCOURS */}
                  <div className="bg-white p-6 rounded-2xl shadow border border-slate-200">
                    <h3 className="font-bold text-emerald-900 text-lg mb-4 flex items-center gap-2 border-b pb-2"><i className="fa-solid fa-trophy text-amber-500"></i> Ajouter un concours</h3>
                    <form onSubmit={ajouterConcours} className="space-y-4">
                      <input required type="text" placeholder="Nom du concours (ex: Doublette Estivale)" value={newConcours.titre} onChange={e=>setNewConcours({...newConcours, titre: e.target.value})} className="w-full border border-slate-300 p-3 rounded-lg bg-slate-50 focus:bg-white outline-none focus:border-emerald-500" />
                      <div className="flex gap-4">
                        <input required type="date" value={newConcours.date} onChange={e=>setNewConcours({...newConcours, date: e.target.value})} className="w-1/2 border border-slate-300 p-3 rounded-lg bg-slate-50 outline-none" />
                        <input required type="time" value={newConcours.heure} onChange={e=>setNewConcours({...newConcours, heure: e.target.value})} className="w-1/2 border border-slate-300 p-3 rounded-lg bg-slate-50 outline-none" title="Heure du jet du but" />
                      </div>
                      <input required type="text" placeholder="Lieu (ex: Boulodrome municipal)" value={newConcours.lieu} onChange={e=>setNewConcours({...newConcours, lieu: e.target.value})} className="w-full border border-slate-300 p-3 rounded-lg bg-slate-50 outline-none" />
                      <input required type="text" placeholder="Dotation / Prix (ex: 150€ + Mises)" value={newConcours.prix} onChange={e=>setNewConcours({...newConcours, prix: e.target.value})} className="w-full border border-slate-300 p-3 rounded-lg bg-slate-50 outline-none" />
                      <button type="submit" className="w-full bg-amber-500 hover:bg-amber-600 text-emerald-950 font-bold py-3 rounded-lg transition">Programmer le concours</button>
                    </form>

                    <div className="mt-6 max-h-48 overflow-y-auto space-y-2 pr-2">
                      {concours.map(c => (
                        <div key={c.id} className="flex justify-between items-center bg-slate-50 p-3 rounded border border-slate-200 text-sm">
                          <span className="font-semibold truncate pr-2">{c.titre} <span className="text-slate-400 font-normal">({c.date})</span></span>
                          <button onClick={() => supprimerConcours(c.id)} className="text-red-500 hover:bg-red-50 p-2 rounded transition"><i className="fa-solid fa-trash"></i></button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* MODIFIER TARIFS & INFOS */}
                <div className="bg-white p-6 rounded-2xl shadow border border-slate-200">
                  <h3 className="font-bold text-emerald-900 text-lg mb-4 flex items-center gap-2 border-b pb-2"><i className="fa-solid fa-sliders text-amber-500"></i> Paramètres généraux (Tarifs & Contact)</h3>
                  <div className="grid md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Tarifs (Licences & Repas)</h4>
                      <div className="flex items-center gap-3">
                        <label className="w-1/3 text-sm font-medium">Licence Adulte</label>
                        <input type="text" value={tarifs.licenceAdulte} onChange={(e) => setTarifs({...tarifs, licenceAdulte: e.target.value})} className="flex-1 border p-2 rounded bg-slate-50" />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="w-1/3 text-sm font-medium">Licence Jeune</label>
                        <input type="text" value={tarifs.licenceJeune} onChange={(e) => setTarifs({...tarifs, licenceJeune: e.target.value})} className="flex-1 border p-2 rounded bg-slate-50" />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="w-1/3 text-sm font-medium">Prix Concours</label>
                        <input type="text" value={tarifs.concoursInscription} onChange={(e) => setTarifs({...tarifs, concoursInscription: e.target.value})} className="flex-1 border p-2 rounded bg-slate-50" />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="w-1/3 text-sm font-medium">Repas Adulte</label>
                        <input type="text" value={tarifs.repasAdulte} onChange={(e) => setTarifs({...tarifs, repasAdulte: e.target.value})} className="flex-1 border p-2 rounded bg-slate-50" />
                      </div>
                    </div>
                    
                    <div className="space-y-3">
                      <h4 className="font-bold text-sm text-slate-500 uppercase tracking-wider">Informations du club</h4>
                      <div className="flex items-center gap-3">
                        <label className="w-1/3 text-sm font-medium">Nom complet</label>
                        <input type="text" value={clubInfo.nom} onChange={(e) => setClubInfo({...clubInfo, nom: e.target.value})} className="flex-1 border p-2 rounded bg-slate-50" />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="w-1/3 text-sm font-medium">Adresse</label>
                        <input type="text" value={clubInfo.adresse} onChange={(e) => setClubInfo({...clubInfo, adresse: e.target.value})} className="flex-1 border p-2 rounded bg-slate-50" />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="w-1/3 text-sm font-medium">Horaires</label>
                        <input type="text" value={clubInfo.horaires} onChange={(e) => setClubInfo({...clubInfo, horaires: e.target.value})} className="flex-1 border p-2 rounded bg-slate-50" />
                      </div>
                      <div className="flex items-center gap-3">
                        <label className="w-1/3 text-sm font-medium">Email contact</label>
                        <input type="text" value={clubInfo.contact} onChange={(e) => setClubInfo({...clubInfo, contact: e.target.value})} className="flex-1 border p-2 rounded bg-slate-50" />
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className="bg-emerald-950 text-emerald-200 py-8 mt-auto border-t-4 border-amber-400">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-6 text-center md:text-left">
          <div className="flex flex-col md:flex-row items-center gap-4">
            <img 
                src="logo.jpg" 
                alt="Logo" 
                className="w-12 h-12 rounded-full border-2 border-emerald-700 object-cover bg-white"
                onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <div>
                <p className="font-bold text-white text-lg">{clubInfo.nom}</p>
                <p className="text-sm text-emerald-400 mt-1">© 2026 Club de Pétanque de Pexiora - Tous droits réservés.</p>
            </div>
          </div>
          <div className="flex gap-4 items-center">
            <a href="#" className="w-10 h-10 rounded-full bg-emerald-900 flex items-center justify-center hover:bg-amber-400 hover:text-emerald-950 transition-colors"><i className="fa-brands fa-facebook-f"></i></a>
            <button 
              onClick={() => { setActiveTab('admin'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-sm font-bold bg-emerald-900 hover:bg-emerald-800 text-amber-300 px-5 py-2.5 rounded-xl border border-emerald-800 transition shadow"
            >
              <i className="fa-solid fa-lock mr-2"></i> Admin
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
