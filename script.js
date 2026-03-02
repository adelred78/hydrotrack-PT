const SUPABASE_URL = 'https://ullusqudzgaqkblsrsoq.supabase.co';
const SUPABASE_ANON_KEY = 'sb_publishable_oNwn7Mn-zQtj-rvM62J6TA_fCIfeCrX';

const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

console.log('Supabase connecté');

/* =========================
   LOGIN
========================= */
const loginForm = document.getElementById('login-form');

if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('username')?.value.trim();
    const password = document.getElementById('password')?.value;

    const { data, error } = await supabaseClient
      .from('utilisateurs')
      .select('*')
      .eq('nom_utilisateur', username)
      .eq('mot_de_passe', password)
      .single();

    if (error || !data) {
      alert('Identifiants incorrects.');
      return;
    }

    localStorage.setItem('user', JSON.stringify(data));
    window.location.href = 'app.html';
  });
}

/* =========================
   SIGNUP
========================= */
const signupForm = document.getElementById('signup-form');

if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const username = document.getElementById('signup-username').value.trim();
    const password = document.getElementById('signup-password').value;

    const superficie = document.getElementById('superficie').value;
    const ville = document.getElementById('ville').value;
    const frequence = document.getElementById('frequence').value;

    if (!username || !password) {
      alert('Veuillez remplir les champs.');
      return;
    }

    // Vérifier si déjà existant
    const { data: existingUser } = await supabaseClient
      .from('utilisateurs')
      .select('id')
      .eq('nom_utilisateur', username)
      .maybeSingle();

    if (existingUser) {
      alert("Nom d'utilisateur déjà utilisé.");
      return;
    }

    // Insertion
    const { data, error } = await supabaseClient
      .from('utilisateurs')
      .insert([
        {
          nom_utilisateur: username,
          mot_de_passe: password,
        },
      ])
      .select()
      .single();

    if (error) {
      alert('Erreur : ' + error.message);
      return;
    }

    // Stockage local
    localStorage.setItem('user', JSON.stringify(data));
    localStorage.setItem(
      'hydrotrack_config',
      JSON.stringify({ superficie, ville, frequence })
    );

    alert('Inscription réussie 🚀');
    window.location.href = 'app.html';
  });
}
