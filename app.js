
const { useState, useEffect } = React;

function App() {
  const [activeTab, setActiveTab] = useState('accueil');
  const [isAdmin, setIsAdmin] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [adminCode, setAdminCode] = useState('Pétanque11150');
  
  // Données initiales modifiables
  const [actualites, setActualites] = useState([
    { id: 1, titre: 'Concours d’ouverture de saison', date: '2026-03-15', desc: 'Beau succès pour notre premier concours de l’année avec plus de 40 équipes présentes.', cat: 'Concours', photo: '' }
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

  const handleLogin = (e) => {
    e.preventDefault();
    if (passwordInput === adminCode) {
      setIsAdmin(true);
      alert('Connexion administrateur réussie !');
    } else {
      alert('Mot de passe incorrect.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 text-slate-800">
      {/* En-tête & Navigation */}
      <header className="bg-emerald-900 text-white shadow-md sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 flex flex-wrap justify-between items-center">
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('accueil')}>
            {/* L'image pointe vers logo.jpg. Si elle n'est pas trouvée, un design de secours s'affiche */}
            <img 
                src="logo.jpg" 
                alt="Logo UBP" 
                className="w-12 h-12 rounded-full object-cover border-2 border-amber-300 bg-white"
                onError={(e) => { 
                    e.target.onerror = null; 
                    e.target.style.display = 'none';
                    document.getElementById('fallback-logo').style.display = 'flex';
                }} 
            />
            <div id="fallback-logo" style={{display: 'none'}} className="w-12 h-12 rounded-full bg-amber-400 items-center justify-center font-bold text-emerald-950 overflow-hidden border-2 border-amber-300">
              <span className="text-xs">UBP</span>
            </div>
            <div>
              <h1 className="font-bold text-lg tracking-wide">{clubInfo.nom}</h1>
              <p className="text-xs text-emerald-200">Aude (11150)</p>
            </div>
          </div>
          <nav className="flex flex-wrap gap-2 mt-2 md:mt-0 text-sm font-medium">
            <button onClick={() => setActiveTab('accueil')} className={`px-3 py-1.5 rounded transition ${activeTab === 'accueil' ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-800'}`}>🏠 Accueil</button>
            <button onClick={() => setActiveTab('actualites')} className={`px-3 py-1.5 rounded transition ${activeTab === 'actualites' ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-800'}`}>📰 Actualités</button>
            <button onClick={() => setActiveTab('photos')} className={`px-3 py-1.5 rounded transition ${activeTab === 'photos' ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-800'}`}>📸 Photos</button>
            <button onClick={() => setActiveTab('concours')} className={`px-3 py-1.5 rounded transition ${activeTab === 'concours' ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-800'}`}>🏆 Concours</button>
            <button onClick={() => setActiveTab('calendrier')} className={`px-3 py-1.5 rounded transition ${activeTab === 'calendrier' ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-800'}`}>📅 Calendrier</button>
            <button onClick={() => setActiveTab('tarifs')} className={`px-3 py-1.5 rounded transition ${activeTab === 'tarifs' ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-800'}`}>💰 Tarifs</button>
            <button onClick={() => setActiveTab('club')} className={`px-3 py-1.5 rounded transition ${activeTab === 'club' ? 'bg-emerald-800 text-amber-300' : 'hover:bg-emerald-800'}`}>👥 Le Club</button>
          </nav>
        </div>
      </header>

      {/* Contenu Principal */}
      <main className="flex-grow container mx-auto px-4 py-8">
        {activeTab === 'accueil' && (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="relative rounded-2xl overflow-hidden bg-emerald-950 text-white p-8 md:p-16 shadow-xl flex flex-col items-center text-center">
              <div className="absolute inset-0 opacity-20 bg-[radial-gradient(#f59e0b_1px,transparent_1px)] [background-size:16px_16px]"></div>
              <h2 className="text-3xl md:text-5xl font-extrabold mb-4 text-amber-300">Bienvenue au Club de Pétanque de Pexiora</h2>
              <p className="text-lg text-emerald-100 max-w-2xl mb-8">Convivialité, passion et sport local au cœur de l'Aude. Rejoignez-nous pour partager de superbes parties de boules !</p>
              <div className="flex gap-4 flex-wrap justify-center">
                <button onClick={() => setActiveTab('concours')} className="z-10 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-6 py-3 rounded-xl shadow-lg transition">Voir les prochains événements</button>
                <button onClick={() => setActiveTab('club')} className="z-10 bg-emerald-800 hover:bg-emerald-700 text-white font-semibold px-6 py-3 rounded-xl transition border border-emerald-600">Découvrir le club</button>
              </div>
            </div>

            {/* Actualités Récentes */}
            <div>
              <h3 className="text-2xl font-bold text-emerald-900 mb-6 border-b-2 border-amber-400 pb-2 inline-block">Dernières actualités</h3>
              <div className="grid md:grid-cols-3 gap-6">
                {actualites.map(actu => (
                  <div key={actu.id} className="bg-white rounded-xl shadow-md overflow-hidden border border-slate-200">
                    <div className="h-40 bg-emerald-800 flex items-center justify-center text-emerald-200 font-semibold">Photo de l'événement</div>
                    <div className="p-5">
                      <span className="text-xs bg-amber-100 text-amber-800 px-2.5 py-1 rounded-full font-semibold">{actu.cat}</span>
                      <h4 className="font-bold text-lg mt-2 text-slate-900">{actu.titre}</h4>
                      <p className="text-xs text-slate-500 mb-3">{actu.date}</p>
                      <p className="text-slate-600 text-sm">{actu.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ... Les autres onglets restent fidèles au design ... */}
        {activeTab === 'actualites' && (
          <div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">Actualités et Événements du Club</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {actualites.map(actu => (
                <div key={actu.id} className="bg-white p-6 rounded-xl shadow border border-slate-200">
                  <span className="text-xs bg-emerald-100 text-emerald-800 px-2.5 py-1 rounded-full font-semibold">{actu.cat}</span>
                  <h3 className="text-xl font-bold mt-2">{actu.titre}</h3>
                  <p className="text-sm text-slate-500 mb-3">{actu.date}</p>
                  <p className="text-slate-700">{actu.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'photos' && (
          <div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">Galerie Photo</h2>
            <p className="text-slate-600 mb-4">Découvrez les moments forts du club en images (Albums : Concours, Repas, Tournois, Vie du club).</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-slate-200 h-48 rounded-xl flex items-center justify-center text-slate-500 font-medium">Album Concours</div>
              <div className="bg-slate-200 h-48 rounded-xl flex items-center justify-center text-slate-500 font-medium">Album Repas</div>
              <div className="bg-slate-200 h-48 rounded-xl flex items-center justify-center text-slate-500 font-medium">Vie du club</div>
              <div className="bg-slate-200 h-48 rounded-xl flex items-center justify-center text-slate-500 font-medium">Tournoi annuel</div>
            </div>
          </div>
        )}

        {activeTab === 'concours' && (
          <div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">Prochains Concours & Événements</h2>
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
              <h3 className="text-xl font-bold text-emerald-900">Prochain Concours de Pétanque</h3>
              <p className="text-slate-600 mt-2">Date : À définir / Prochainement</p>
              <p className="text-slate-600">Lieu : Terrain municipal de Pexiora</p>
            </div>
          </div>
        )}

        {activeTab === 'calendrier' && (
          <div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">Calendrier Interactif</h2>
            <div className="bg-white p-8 rounded-xl shadow text-center text-slate-500">
              Calendrier mensuel des concours, repas et réunions du club.
            </div>
          </div>
        )}

        {activeTab === 'tarifs' && (
          <div>
            <h2 className="text-3xl font-bold text-emerald-900 mb-6">Tarifs du Club</h2>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h3 className="font-bold text-lg text-emerald-900 mb-3">Licences</h3>
                <p className="text-sm text-slate-600 mb-2">Adulte : <span className="font-semibold text-slate-900">{tarifs.licenceAdulte}</span></p>
                <p className="text-sm text-slate-600">Jeune : <span className="font-semibold text-slate-900">{tarifs.licenceJeune}</span></p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h3 className="font-bold text-lg text-emerald-900 mb-3">Concours</h3>
                <p className="text-sm text-slate-600">Inscription : <span className="font-semibold text-slate-900">{tarifs.concoursInscription}</span></p>
              </div>
              <div className="bg-white p-6 rounded-xl shadow border border-slate-200">
                <h3 className="font-bold text-lg text-emerald-900 mb-3">Repas</h3>
                <p className="text-sm text-slate-600 mb-2">Adulte : <span className="font-semibold text-slate-900">{tarifs.repasAdulte}</span></p>
                <p className="text-sm text-slate-600">Enfant : <span className="font-semibold text-slate-900">{tarifs.repasEnfant}</span></p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'club' && (
          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-emerald-900">Le Club - {clubInfo.nom}</h2>
            <div className="bg-white p-6 rounded-xl shadow border border-slate-200 space-y-4">
              <p className="text-slate-700">Situé à Pexiora dans l'Aude, l'Union Bouliste de Pexiora (UBP) rassemble les passionnés de pétanque et de convivialité dans une ambiance chaleureuse et sportive.</p>
              <div className="border-t pt-4">
                <h4 className="font-bold text-emerald-900 mb-2">Informations pratiques :</h4>
                <p className="text-sm text-slate-600">📍 {clubInfo.adresse}</p>
                <p className="text-sm text-slate-600">🕒 {clubInfo.horaires}</p>
                <p className="text-sm text-slate-600">✉️ {clubInfo.contact}</p>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'admin' && (
          <div className="max-w-xl mx-auto bg-white p-8 rounded-2xl shadow-xl border border-slate-200">
            {!isAdmin ? (
              <form onSubmit={handleLogin} className="space-y-4">
                <h2 className="text-2xl font-bold text-emerald-900 mb-2">Espace Administrateur</h2>
                <p className="text-sm text-slate-500 mb-4">Veuillez entrer le mot de passe administrateur pour gérer le contenu du site.</p>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Mot de passe</label>
                  <input 
                    type="password" 
                    value={passwordInput} 
                    onChange={(e) => setPasswordInput(e.target.value)} 
                    className="w-full border border-slate-300 rounded-lg p-3 focus:ring-2 focus:ring-emerald-500 outline-none" 
                    placeholder="Entrez le mot de passe"
                  />
                </div>
                <button type="submit" className="w-full bg-emerald-900 hover:bg-emerald-800 text-white font-bold p-3 rounded-lg transition">Se connecter</button>
              </form>
            ) : (
              <div className="space-y-6">
                <div className="flex justify-between items-center border-b pb-4">
                  <h2 className="text-2xl font-bold text-emerald-900">Panneau de Gestion</h2>
                  <button onClick={() => setIsAdmin(false)} className="text-red-600 hover:text-red-800 text-sm font-semibold">Déconnexion</button>
                </div>
                <div className="space-y-4">
                  <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200">
                    <h3 className="font-bold text-emerald-900 mb-1">Gestion des Tarifs</h3>
                    <p className="text-xs text-emerald-700 mb-3">Modifiez les tarifs affichés sur le site instantanément.</p>
                    <div className="grid grid-cols-2 gap-2">
                      <input 
                        type="text" 
                        value={tarifs.licenceAdulte} 
                        onChange={(e) => setTarifs({...tarifs, licenceAdulte: e.target.value})} 
                        className="border p-2 rounded text-sm bg-white"
                        placeholder="Licence adulte"
                      />
                      <input 
                        type="text" 
                        value={tarifs.licenceJeune} 
                        onChange={(e) => setTarifs({...tarifs, licenceJeune: e.target.value})} 
                        className="border p-2 rounded text-sm bg-white"
                        placeholder="Licence jeune"
                      />
                    </div>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <h3 className="font-bold text-slate-900 mb-1">Paramètres du Club</h3>
                    <input 
                      type="text" 
                      value={clubInfo.nom} 
                      onChange={(e) => setClubInfo({...clubInfo, nom: e.target.value})} 
                      className="border p-2 rounded text-sm bg-white w-full mb-2"
                      placeholder="Nom du club"
                    />
                    <input 
                      type="text" 
                      value={clubInfo.adresse} 
                      onChange={(e) => setClubInfo({...clubInfo, adresse: e.target.value})} 
                      className="border p-2 rounded text-sm bg-white w-full"
                      placeholder="Adresse"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Pied de page */}
      <footer className="bg-emerald-950 text-emerald-200 py-8 mt-auto border-t border-emerald-900">
        <div className="container mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4 text-center md:text-left">
          <div className="flex items-center gap-3">
            <img 
                src="logo.jpg" 
                alt="Logo" 
                className="w-8 h-8 rounded-full border border-emerald-700 object-cover bg-white"
                onError={(e) => { e.target.style.display = 'none'; }} 
            />
            <div>
                <p className="font-bold text-white text-lg">Union Bouliste de Pexiora (UBP)</p>
                <p className="text-xs text-emerald-400 mt-1">© 2026 Club de Pétanque de Pexiora - Tous droits réservés.</p>
            </div>
          </div>
          <div>
            <button 
              onClick={() => { setActiveTab('admin'); window.scrollTo({top: 0, behavior: 'smooth'}); }} 
              className="text-xs bg-emerald-900 hover:bg-emerald-800 text-amber-300 px-4 py-2 rounded-lg border border-emerald-800 transition shadow"
            >
              🔐 Administration
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
