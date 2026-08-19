const { useState, useEffect } = React;

const SUPABASE_URL = 'https://hhqmqhlcmrcunexdifxh.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhocW1xaGxjbXJjdW5leGRpZnhoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODcxMjY2NjIsImV4cCI6MjEwMjcwMjY2Mn0.AyfUo_4_zQ6wYZZCF25xxaHTLWAysTBOpYI4JymMCyI' ;

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

function App() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [adminCode, setAdminCode] = useState('Pétanque11150');
  const [newPassword, setNewPassword] = useState('');

  const [actualites, setActualites] = useState([]);
  const [concours, setConcours] = useState([]);
  const [victoires, setVictoires] = useState([]);

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

  const [newActu, setNewActu] = useState({ titre: '', date: '', desc: '', cat: 'Actualité' });
  const [newConcours, setNewConcours] = useState({ titre: '', date: '', lieu: 'Boulodrome municipal', heure: '14h00', prix: '' });
  const [newGagnant, setNewGagnant] = useState({ nom_joueur: '', tournoi: '', date: '' });

  useEffect(() => {
    fetchActualites();
    fetchConcours();
    fetchVictoires();
    fetchConfig();
  }, []);

  const fetchActualites = async () => {
    const { data } = await supabaseClient.from('actualites').select('*').order('id', { ascending: false });
    if (data) setActualites(data);
  };

  const fetchConcours = async () => {
    const { data } = await supabaseClient.from('concours').select('*').order('date', { ascending: true });
    if (data) setConcours(data);
  };

  const fetchVictoires = async () => {
    const { data } = await supabaseClient.from('tournois_gagnants').select('*').order('id', { ascending: false });
    if (data) setVictoires(data);
  };

  const fetchConfig = async () => {
    const { data } = await supabaseClient.from('configuration').select('*');
    if (data) {
      data.forEach(item => {
        if (item.id === 'tarifs') setTarifs(item.donnees);
        if (item.id === 'clubInfo') setClubInfo(item.donnees);
        if (item.id === 'password') setAdminCode(item.donnees);
      });
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminCode) {
      setIsAdmin(true);
      setPasswordInput('');
    } else {
      alert('Mot de passe incorrect.');
    }
  };

  const changerMotDePasse = async (e) => {
    e.preventDefault();
    if (!newPassword.trim()) return;
    const { error } = await supabaseClient
      .from('configuration')
      .upsert({ id: 'password', donnees: newPassword });

    if (error) {
      alert(`Erreur : ${error.message}`);
    } else {
      setAdminCode(newPassword);
      setNewPassword('');
      alert('Mot de passe administrateur mis à jour avec succès !');
    }
  };

  const ajouterActualite = async (e) => {
    e.preventDefault();
    const { data, error } = await supabaseClient.from('actualites').insert([newActu]).select();
    if (error) alert(`Erreur : ${error.message}`);
    else if (data) {
      setActualites([data[0], ...actualites]);
      setNewActu({ titre: '', date: '', desc: '', cat: 'Actualité' });
    }
  };

  const supprimerActualite = async (id) => {
    if (window.confirm('Supprimer cette actualité ?')) {
      const { error } = await supabaseClient.from('actualites').delete().eq('id', id);
      if (!error) setActualites(actualites.filter(a => a.id !== id));
    }
  };

  const ajouterConcours = async (e) => {
    e.preventDefault();
    const { data, error } = await supabaseClient.from('concours').insert([newConcours]).select();
    if (error) alert(`Erreur : ${error.message}`);
    else if (data) {
      const updated = [...concours, data[0]].sort((a, b) => new Date(a.date) - new Date(b.date));
      setConcours(updated);
      setNewConcours({ titre: '', date: '', lieu: 'Boulodrome municipal', heure: '14h00', prix: '' });
    }
  };

  const supprimerConcours = async (id) => {
    if (window.confirm('Supprimer ce concours ?')) {
      const { error } = await supabaseClient.from('concours').delete().eq('id', id);
      if (!error) setConcours(concours.filter(c => c.id !== id));
    }
  };

  const ajouterGagnant = async (e) => {
    e.preventDefault();
    const { data, error } = await supabaseClient.from('tournois_gagnants').insert([newGagnant]).select();
    if (error) alert(`Erreur : ${error.message}`);
    else if (data) {
      setVictoires([data[0], ...victoires]);
      setNewGagnant({ nom_joueur: '', tournoi: '', date: '' });
    }
  };

  const supprimerGagnant = async (id) => {
    if (window.confirm('Supprimer cette victoire ?')) {
      const { error } = await supabaseClient.from('tournois_gagnants').delete().eq('id', id);
      if (!error) setVictoires(victoires.filter(v => v.id !== id));
    }
  };

  const reinitialiserPodium = async () => {
    if (window.confirm('ATTENTION : Voulez-vous vraiment réinitialiser tout le podium pour la nouvelle saison ? Cette action supprimera toutes les victoires enregistrées.')) {
      const { error } = await supabaseClient.from('tournois_gagnants').delete().neq('id', 0);
      if (error) alert(`Erreur : ${error.message}`);
      else {
        setVictoires([]);
        alert('Podium réinitialisé pour la nouvelle saison !');
      }
    }
  };

  const sauvegarderTarifs = async (e) => {
    e.preventDefault();
    const { error } = await supabaseClient.from('configuration').upsert({ id: 'tarifs', donnees: tarifs });
    if (error) alert(`Erreur : ${error.message}`);
    else alert('Tarifs sauvegardés !');
  };

  const sauvegarderClubInfo = async (e) => {
    e.preventDefault();
    const { error } = await supabaseClient.from('configuration').upsert({ id: 'clubInfo', donnees: clubInfo });
    if (error) alert(`Erreur : ${error.message}`);
    else alert('Informations du club sauvegardées !');
  };

  // Calcul du classement général
  const calculerClassement = () => {
    const scores = {};
    victoires.forEach(v => {
      const nom = v.nom_joueur.trim();
      scores[nom] = (scores[nom] || 0) + 1;
    });

    return Object.entries(scores)
      .map(([nom, total]) => ({ nom, total }))
      .sort((a, b) => b.total - a.total);
  };

  const classement = calculerClassement();

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      <header className="bg-emerald-900 text-white shadow-lg sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer group" onClick={() => setActiveTab('accueil')}>
            <img src="logo.jpg" alt="Logo UBP" className="w-14 h-14 rounded-full object-cover border-2 border-amber-400 bg-white shadow-md group-hover:scale-105 transition-transform" onError={(e) => { e.target.style.display = 'none'; const fb = document.getElementById('fallback-logo'); if (fb) fb.style.display = 'flex'; }} />
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
              { id: 'podium', icon: 'fa-ranking-star', label: 'Podium' },
              { id: 'tarifs', icon: 'fa-coins', label: 'Tarifs' },
              { id: 'club', icon: 'fa-users', label: 'Le Club' }
            ].map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`px-4 py-2 rounded-lg transition-all duration-200 flex items-center gap-2 ${activeTab === tab.id ? 'bg-amber-400 text-emerald-950 shadow-md' : 'hover:bg-emerald-800 text-emerald-50'}`}>
                <i className={`fa-solid ${tab.icon}`}></i> {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'accueil' && (
          <div className="space-y-12 animate-fade-in">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-emerald-900 to-emerald-950 text-white p-10 md:p-20 shadow-2xl flex flex-col items-center text-center border-b-4 border-amber-400">
              <h2 className="text-4xl md:text-6xl font-black mb-6 text-transparent bg-clip-text bg-gradient-to-r from-amber-200 to-amber-500 drop-shadow-lg">
                Bienvenue au Club de Pétanque !
              </h2>
              <p className="text-xl text-emerald-100 max-w-3xl mb-10 leading-relaxed">
                Convivialité, passion et sport local au cœur de l'Aude. Rejoignez l'UBP pour partager de superbes parties de boules à Pexiora !
              </p>
              <div className="flex gap-4 flex-wrap justify-center relative z-10">
                <button onClick={() => setActiveTab('concours')} className="bg-amber-500 hover:bg-amber-400 text-emerald-950 font-bold px-8 py-4 rounded-xl shadow-lg transition-all transform hover:-translate-y-1 text-lg">
                  <i className="fa-solid fa-calendar-check mr-2"></i> Prochains événements
                </button>
                <button onClick={() => setActiveTab('podium')} className="bg-emerald-800/80 backdrop-blur hover:bg-emerald-700 text-white font-semibold px-8 py-4 rounded-xl transition-all border border-emerald-600 hover:border-emerald-400 text-lg">
                  <i className="fa-solid fa-ranking-star mr-2"></i> Voir le classement
                </button>
              </div>
            </div>

            <div className="grid md:grid-cols-2 gap-8">
              <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
                <h3 className="text-2xl font-bold text-emerald-900 mb-6 flex items-center gap-3">
                  <i className="fa-regular fa-newspaper text-amber-500"></i> À la une
                </h3>
                <div className="space-y-4">
                  {actualites.slice(0, 3).map(actu => (
                    <div key={actu.id} className="border-l-4 border-amber-400 pl-4 py-2 bg-slate-50 rounded-r-lg">
                      <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{actu.cat}</span>
                      <h4 className="font-bold text-lg text-slate-800 leading-tight mt-1">{actu.titre}</h4>
                      <p className="text-sm text-slate-500 mb-1"><i className="fa-regular fa-clock mr-1"></i> {actu.date}</p>
                    </div>
                  ))}
                  {actualites.length === 0 && <p className="text-slate-500 italic">Aucune actualité récente.</p>}
                </div>
                <button onClick={() => setActiveTab('actualites')} className="mt-6 text-emerald-700 font-bold hover:text-emerald-900 text-sm">Voir toutes les actualités &rarr;</button>
              </div>

              <div className="bg-emerald-900 rounded-2xl shadow-lg p-8 text-white">
                <h3 className="text-2xl font-bold text-amber-400 mb-6 flex items-center gap-3">
                  <i className="fa-solid fa-trophy"></i> Prochain Concours
                </h3>
                {concours.length > 0 ? (
                  <div className="bg-emerald-950/50 p-6 rounded-xl border border-emerald-800/50">
                    <h4 className="text-xl font-bold text-white mb-2">{concours[0].titre}</h4>
                    <ul className="space-y-3 mt-4 text-emerald-100">
                      <li className="flex items-center gap-3"><i className="fa-regular fa-calendar text-amber-400 w-5"></i> {concours[0].date}</li>
                      <li className="flex items-center gap-3"><i className="fa-regular fa-clock text-amber-400 w-5"></i> Jet du but : {concours[0].heure}</li>
                      <li className="flex items-center gap-3"><i className="fa-solid fa-location-dot text-amber-400 w-5"></i> {concours[0].lieu}</li>
                      <li className="flex items-center gap-3"><i className="fa-solid fa-gift text-amber-400 w-5"></i> {concours[0].prix}</li>
                    </ul>
                  </div>
                ) : (
                  <p className="text-emerald-200 italic">Aucun concours programmé.</p>
                )}
                <button onClick={() => setActiveTab('concours')} className="mt-6 text-amber-400 font-bold hover:text-amber-300 text-sm">Voir le calendrier complet &rarr;</button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'actualites' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-2 border-b-4 border-amber-400 inline-block pb-2">Actualités du Club</h2>
            <div className="space-y-6 mt-6">
              {actualites.length === 0 ? (
                <p className="text-center text-slate-500 py-10">Aucune actualité pour le moment.</p>
              ) : (
                actualites.map(actu => (
                  <div key={actu.id} className="bg-white p-6 rounded-2xl shadow-sm border border-slate-200">
                    <div className="flex justify-between items-start mb-4">
                      <span className="text-xs bg-amber-100 text-amber-800 px-3 py-1.5 rounded-full font-bold uppercase">{actu.cat}</span>
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

        {activeTab === 'concours' && (
          <div className="max-w-4xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-2 border-b-4 border-amber-400 inline-block pb-2">Calendrier des Concours</h2>
            <div className="grid gap-6 mt-6">
              {concours.length === 0 ? (
                <p className="text-center text-slate-500 py-10">Aucun concours programmé.</p>
              ) : (
                concours.map(c => (
                  <div key={c.id} className="flex flex-col md:flex-row bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
                    <div className="bg-emerald-900 text-white p-6 md:w-48 flex flex-col justify-center items-center text-center">
                      <i className="fa-solid fa-trophy text-3xl text-amber-400 mb-2"></i>
                      <span className="font-bold text-lg">{c.date}</span>
                      <span className="text-emerald-300 text-sm mt-1">{c.heure}</span>
                    </div>
                    <div className="p-6 flex-grow flex flex-col justify-center">
                      <h3 className="text-xl font-bold text-slate-800 mb-2">{c.titre}</h3>
                      <div className="text-sm text-slate-600 space-y-1">
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

        {activeTab === 'podium' && (
          <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-extrabold text-emerald-900 mb-2 border-b-4 border-amber-400 inline-block pb-2">Podium & Saison</h2>
              <p className="text-slate-600 mt-2">Classement des joueurs ayant remporté le plus de tournois cette saison.</p>
            </div>

            {/* Top 3 Visuel */}
            {classement.length > 0 && (
              <div className="flex justify-center items-end gap-4 pt-8 pb-4">
                {/* 2ème place */}
                {classement[1] && (
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-slate-700 text-sm mb-1">{classement[1].nom}</span>
                    <span className="text-xs bg-slate-200 text-slate-700 px-2 py-0.5 rounded-full font-bold mb-2">{classement[1].total} vic.</span>
                    <div className="w-24 bg-slate-300 h-28 rounded-t-2xl flex items-center justify-center text-3xl font-black text-slate-500 shadow">2</div>
                  </div>
                )}

                {/* 1ère place */}
                {classement[0] && (
                  <div className="flex flex-col items-center">
                    <i className="fa-solid fa-crown text-amber-400 text-2xl mb-1 animate-bounce"></i>
                    <span className="font-extrabold text-emerald-950 text-base mb-1">{classement[0].nom}</span>
                    <span className="text-xs bg-amber-400 text-emerald-950 px-2.5 py-0.5 rounded-full font-black mb-2">{classement[0].total} vic.</span>
                    <div className="w-28 bg-gradient-to-t from-amber-500 to-amber-300 h-36 rounded-t-2xl flex items-center justify-center text-4xl font-black text-emerald-950 shadow-lg border-t-2 border-amber-200">1</div>
                  </div>
                )}

                {/* 3ème place */}
                {classement[2] && (
                  <div className="flex flex-col items-center">
                    <span className="font-bold text-slate-700 text-sm mb-1">{classement[2].nom}</span>
                    <span className="text-xs bg-amber-800/20 text-amber-900 px-2 py-0.5 rounded-full font-bold mb-2">{classement[2].total} vic.</span>
                    <div className="w-24 bg-amber-700/40 h-20 rounded-t-2xl flex items-center justify-center text-3xl font-black text-amber-900 shadow">3</div>
                  </div>
                )}
              </div>
            )}

            {/* Tableau complet */}
            <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
              <div className="bg-emerald-900 text-white p-4 font-bold flex justify-between items-center">
                <span>Classement Général</span>
                <span className="text-xs text-amber-300">{classement.length} Joueur(s) classé(s)</span>
              </div>
              <div className="divide-y divide-slate-100">
                {classement.length === 0 ? (
                  <p className="p-6 text-center text-slate-500">Aucun résultat enregistré pour le moment cette saison.</p>
                ) : (
                  classement.map((joueur, idx) => (
                    <div key={joueur.nom} className="p-4 flex items-center justify-between hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <span className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm ${idx === 0 ? 'bg-amber-400 text-emerald-950' : idx === 1 ? 'bg-slate-200 text-slate-700' : idx === 2 ? 'bg-amber-800/20 text-amber-900' : 'text-slate-400'}`}>
                          {idx + 1}
                        </span>
                        <span className="font-bold text-slate-800">{joueur.nom}</span>
                      </div>
                      <span className="font-extrabold text-emerald-900 bg-emerald-50 px-3 py-1 rounded-full text-sm">
                        {joueur.total} {joueur.total > 1 ? 'victoires' : 'victoire'}
                      </span>
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Historique des victoires */}
            <div className="bg-white p-6 rounded-2xl shadow border border-slate-200">
              <h3 className="font-bold text-emerald-900 text-lg mb-4 flex items-center gap-2">
                <i className="fa-solid fa-list-check"></i> Historique des tournois de la saison
              </h3>
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {victoires.map(v => (
                  <div key={v.id} className="flex justify-between items-center p-3 bg-slate-50 rounded-lg text-sm border">
                    <div>
                      <span className="font-bold text-slate-800 mr-2">{v.nom_joueur}</span>
                      <span className="text-slate-500">— {v.tournoi}</span>
                    </div>
                    <span className="text-xs text-slate-400">{v.date}</span>
                  </div>
                ))}
                {victoires.length === 0 && <p className="text-slate-500 italic text-sm">Aucun tournoi enregistré.</p>}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tarifs' && (
          <div className="max-w-5xl mx-auto animate-fade-in">
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-2 border-b-4 border-amber-400 inline-block pb-2">Tarifs & Adhésions</h2>
            <div className="grid md:grid-cols-3 gap-6 mt-8">
              <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
                <div className="bg-emerald-900 p-4 text-center text-white font-bold">Licences Annuelles</div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between"><span>Adulte</span><span className="font-bold text-emerald-800">{tarifs.licenceAdulte}</span></div>
                  <div className="flex justify-between"><span>Jeune</span><span className="font-bold text-emerald-800">{tarifs.licenceJeune}</span></div>
                </div>
              </div>
              <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
                <div className="bg-emerald-900 p-4 text-center text-white font-bold">Inscriptions Concours</div>
                <div className="p-6 text-center font-black text-3xl text-amber-500">{tarifs.concoursInscription}</div>
              </div>
              <div className="bg-white rounded-2xl shadow border border-slate-200 overflow-hidden">
                <div className="bg-emerald-900 p-4 text-center text-white font-bold">Repas du Club</div>
                <div className="p-6 space-y-4">
                  <div className="flex justify-between"><span>Menu Adulte</span><span className="font-bold text-emerald-800">{tarifs.repasAdulte}</span></div>
                  <div className="flex justify-between"><span>Menu Enfant</span><span className="font-bold text-emerald-800">{tarifs.repasEnfant}</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'club' && (
          <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            <h2 className="text-3xl font-extrabold text-emerald-900 mb-2 border-b-4 border-amber-400 inline-block pb-2">À propos du club</h2>
            <div className="bg-white p-8 rounded-2xl shadow border border-slate-200">
              <p className="text-lg text-slate-700 mb-6">
                Situé au cœur de Pexiora dans l'Aude, l'<strong>{clubInfo.nom}</strong> rassemble les passionnés de pétanque dans une ambiance conviviale et sportive.
              </p>
              <div className="bg-slate-50 p-6 rounded-xl space-y-3">
                <p><i className="fa-solid fa-location-dot text-emerald-600 mr-2"></i> {clubInfo.adresse}</p>
                <p><i className="fa-solid fa-clock text-emerald-600 mr-2"></i> {clubInfo.horaires}</p>
                <p><i className="fa-solid fa-envelope text-emerald-600 mr-2"></i> {clubInfo.contact}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-4xl mx-auto animate-fade-in space-y-8">
            {!isAdmin ? (
              <div className="bg-white p-10 rounded-3xl shadow-xl border border-slate-200 text-center max-w-md mx-auto">
                <h2 className="text-2xl font-extrabold text-emerald-900 mb-6">Espace Dirigeants</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                  <input 
                    type="password" 
                    value={passwordInput} 
                    onChange={(e) => setPasswordInput(e.target.value)} 
                    className="w-full border-2 border-slate-200 rounded-xl p-4 text-center font-mono" 
                    placeholder="Mot de passe..." 
                  />
                  <button type="submit" className="w-full bg-emerald-900 text-amber-300 font-bold p-4 rounded-xl">Déverrouiller</button>
                </form>
              </div>
            ) : (
              <div className="space-y-8">
                <div className="flex justify-between items-center bg-emerald-900 text-white p-6 rounded-2xl">
                  <h2 className="text-2xl font-bold">Panneau d'Administration</h2>
                  <button onClick={() => setIsAdmin(false)} className="bg-red-500 text-white px-4 py-2 rounded-lg text-sm font-bold">Déconnexion</button>
                </div>

                {/* Gestion Podium / Victoires */}
                <div className="bg-white p-6 rounded-2xl shadow border">
                  <div className="flex flex-wrap justify-between items-center mb-4 gap-2">
                    <h3 className="font-bold text-emerald-900 text-lg flex items-center gap-2">
                      <i className="fa-solid fa-trophy text-amber-500"></i> Ajouter un gagnant au Podium
                    </h3>
                    <button onClick={reinitialiserPodium} className="bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-3 py-2 rounded-lg transition-colors">
                      <i className="fa-solid fa-rotate-left mr-1"></i> Réinitialiser le podium (Nouvelle saison)
                    </button>
                  </div>
                  <form onSubmit={ajouterGagnant} className="grid md:grid-cols-3 gap-3 mb-4">
                    <input required type="text" placeholder="Nom du vainqueur" value={newGagnant.nom_joueur} onChange={e=>setNewGagnant({...newGagnant, nom_joueur: e.target.value})} className="border p-2 rounded text-sm" />
                    <input required type="text" placeholder="Nom du tournoi" value={newGagnant.tournoi} onChange={e=>setNewGagnant({...newGagnant, tournoi: e.target.value})} className="border p-2 rounded text-sm" />
                    <input required type="date" value={newGagnant.date} onChange={e=>setNewGagnant({...newGagnant, date: e.target.value})} className="border p-2 rounded text-sm" />
                    <button type="submit" className="md:col-span-3 bg-amber-500 text-emerald-950 font-bold py-2 rounded text-sm">Ajouter la victoire</button>
                  </form>
                  <div className="max-h-40 overflow-y-auto space-y-2">
                    {victoires.map(v => (
                      <div key={v.id} className="flex justify-between items-center bg-slate-50 p-2 text-sm border rounded">
                        <span><strong>{v.nom_joueur}</strong> — {v.tournoi} ({v.date})</span>
                        <button onClick={() => supprimerGagnant(v.id)} className="text-red-500 font-bold ml-2">X</button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  {/* Actualités */}
                  <div className="bg-white p-6 rounded-2xl shadow border">
                    <h3 className="font-bold text-emerald-900 text-lg mb-4">Publier une actualité</h3>
                    <form onSubmit={ajouterActualite} className="space-y-3">
                      <input required type="text" placeholder="Titre" value={newActu.titre} onChange={e=>setNewActu({...newActu, titre: e.target.value})} className="w-full border p-2 rounded" />
                      <input required type="date" value={newActu.date} onChange={e=>setNewActu({...newActu, date: e.target.value})} className="w-full border p-2 rounded" />
                      <select value={newActu.cat} onChange={e=>setNewActu({...newActu, cat: e.target.value})} className="w-full border p-2 rounded">
                        <option>Actualité</option>
                        <option>Résultats</option>
                        <option>Vie du club</option>
                      </select>
                      <textarea required placeholder="Texte..." value={newActu.desc} onChange={e=>setNewActu({...newActu, desc: e.target.value})} className="w-full border p-2 rounded h-20"></textarea>
                      <button type="submit" className="w-full bg-emerald-600 text-white font-bold py-2 rounded">Ajouter à Supabase</button>
                    </form>
                    <div className="mt-4 max-h-40 overflow-y-auto space-y-2">
                      {actualites.map(a => (
                        <div key={a.id} className="flex justify-between items-center bg-slate-50 p-2 text-sm border rounded">
                          <span className="truncate">{a.titre}</span>
                          <button onClick={() => supprimerActualite(a.id)} className="text-red-500 font-bold ml-2">X</button>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Concours */}
                  <div className="bg-white p-6 rounded-2xl shadow border">
                    <h3 className="font-bold text-emerald-900 text-lg mb-4">Ajouter un concours</h3>
                    <form onSubmit={ajouterConcours} className="space-y-3">
                      <input required type="text" placeholder="Nom du concours" value={newConcours.titre} onChange={e=>setNewConcours({...newConcours, titre: e.target.value})} className="w-full border p-2 rounded" />
                      <input required type="date" value={newConcours.date} onChange={e=>setNewConcours({...newConcours, date: e.target.value})} className="w-full border p-2 rounded" />
                      <input required type="time" value={newConcours.heure} onChange={e=>setNewConcours({...newConcours, heure: e.target.value})} className="w-full border p-2 rounded" />
                      <input required type="text" placeholder="Lieu" value={newConcours.lieu} onChange={e=>setNewConcours({...newConcours, lieu: e.target.value})} className="w-full border p-2 rounded" />
                      <input required type="text" placeholder="Dotation / Prix" value={newConcours.prix} onChange={e=>setNewConcours({...newConcours, prix: e.target.value})} className="w-full border p-2 rounded" />
                      <button type="submit" className="w-full bg-amber-500 text-emerald-950 font-bold py-2 rounded">Programmer le concours</button>
                    </form>
                    <div className="mt-4 max-h-40 overflow-y-auto space-y-2">
                      {concours.map(c => (
                        <div key={c.id} className="flex justify-between items-center bg-slate-50 p-2 text-sm border rounded">
                          <span className="truncate">{c.titre}</span>
                          <button onClick={() => supprimerConcours(c.id)} className="text-red-500 font-bold ml-2">X</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-6">
                  {/* Modification des Tarifs */}
                  <div className="bg-white p-6 rounded-2xl shadow border">
                    <h3 className="font-bold text-emerald-900 text-lg mb-4">Modifier les Tarifs</h3>
                    <form onSubmit={sauvegarderTarifs} className="space-y-3 text-sm">
                      <div>
                        <label className="block text-slate-600 font-medium">Licence Adulte</label>
                        <input type="text" value={tarifs.licenceAdulte} onChange={e=>setTarifs({...tarifs, licenceAdulte: e.target.value})} className="w-full border p-2 rounded" />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium">Licence Jeune</label>
                        <input type="text" value={tarifs.licenceJeune} onChange={e=>setTarifs({...tarifs, licenceJeune: e.target.value})} className="w-full border p-2 rounded" />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium">Inscription Concours</label>
                        <input type="text" value={tarifs.concoursInscription} onChange={e=>setTarifs({...tarifs, concoursInscription: e.target.value})} className="w-full border p-2 rounded" />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium">Repas Adulte</label>
                        <input type="text" value={tarifs.repasAdulte} onChange={e=>setTarifs({...tarifs, repasAdulte: e.target.value})} className="w-full border p-2 rounded" />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium">Repas Enfant</label>
                        <input type="text" value={tarifs.repasEnfant} onChange={e=>setTarifs({...tarifs, repasEnfant: e.target.value})} className="w-full border p-2 rounded" />
                      </div>
                      <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-2 rounded mt-2">Enregistrer les tarifs</button>
                    </form>
                  </div>

                  {/* Informations Club */}
                  <div className="bg-white p-6 rounded-2xl shadow border">
                    <h3 className="font-bold text-emerald-900 text-lg mb-4">Infos du Club</h3>
                    <form onSubmit={sauvegarderClubInfo} className="space-y-3 text-sm">
                      <div>
                        <label className="block text-slate-600 font-medium">Nom du club</label>
                        <input type="text" value={clubInfo.nom} onChange={e=>setClubInfo({...clubInfo, nom: e.target.value})} className="w-full border p-2 rounded" />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium">Adresse</label>
                        <input type="text" value={clubInfo.adresse} onChange={e=>setClubInfo({...clubInfo, adresse: e.target.value})} className="w-full border p-2 rounded" />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium">Horaires</label>
                        <input type="text" value={clubInfo.horaires} onChange={e=>setClubInfo({...clubInfo, horaires: e.target.value})} className="w-full border p-2 rounded" />
                      </div>
                      <div>
                        <label className="block text-slate-600 font-medium">Email / Contact</label>
                        <input type="text" value={clubInfo.contact} onChange={e=>setClubInfo({...clubInfo, contact: e.target.value})} className="w-full border p-2 rounded" />
                      </div>
                      <button type="submit" className="w-full bg-emerald-800 text-white font-bold py-2 rounded mt-2">Enregistrer les infos</button>
                    </form>
                  </div>

                  {/* Changement de mot de passe */}
                  <div className="bg-white p-6 rounded-2xl shadow border">
                    <h3 className="font-bold text-emerald-900 text-lg mb-4">Sécurité</h3>
                    <form onSubmit={changerMotDePasse} className="space-y-3 text-sm">
                      <div>
                        <label className="block text-slate-600 font-medium">Nouveau mot de passe admin</label>
                        <input required type="password" value={newPassword} onChange={e=>setNewPassword(e.target.value)} placeholder="Saisir le nouveau mot de passe..." className="w-full border p-2 rounded font-mono" />
                      </div>
                      <button type="submit" className="w-full bg-amber-500 text-emerald-950 font-bold py-2 rounded mt-2">Mettre à jour le mot de passe</button>
                    </form>
                  </div>
                </div>

              </div>
            )}
          </div>
        )}
      </main>

      <footer className="bg-emerald-950 text-emerald-200 py-6 mt-auto">
        <div className="container mx-auto px-4 flex justify-between items-center text-sm">
          <p>© 2026 {clubInfo.nom}</p>
          <button onClick={() => { setActiveTab('admin'); window.scrollTo({top: 0, behavior: 'smooth'}); }} className="text-amber-300 font-bold">Admin</button>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);