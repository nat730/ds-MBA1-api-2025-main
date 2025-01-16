import './style.css'

const app = document.querySelector<HTMLDivElement>('#app')

if (app) {
  const token = localStorage.getItem('token')
  if(token){
    app.innerHTML = `
    <div class="home">
      <h1>Home</h1>
      <p>Bienvenue, vous êtes connectés !</p>
      <p>Voici votre token: ${token}</p>

      <h2>Mes datas de le miel ^^</h2>

      <ul>
        <li id="all-datas">Tous les miels</li>
        <li id="one-data">Un miel</li>
        <li id="add-data">Ajouter un miel</li>
        <li id="update-data">Modifier un miel</li>
        <li id="delete-data">Supprimer un miel</li>
      </ul>

      <h2>Les miels par tags</h2>

      <ul>
        <li id="first-tags">Les miels #bio et #sapin</li>
        <li id="other-tags">les miels #bio de #lavande ou de #montagne</li>
        <li id="add-tag">Ajouter le tag accacia</li>
      </ul>

      <div id="datas"></div>

      <p>Vous pouvez vous déconnecter en cliquant sur le bouton ci-dessous</p>
      <button id="logout">Logout</button>
    </div>
  `
  }
  else {
    app.innerHTML = `
    <div class="login">
      <h1>Login</h1>
      <input type="text" placeholder="Username" id="username">
      <input type="password" placeholder="Password" id="password">
      <button id="login">Login</button>
    </div>
  `
  }

  const loginBtn = document.querySelector<HTMLButtonElement>('#login')
  loginBtn?.addEventListener('click', async () => {
    const username = document.querySelector<HTMLInputElement>('#username')?.value
    const password = document.querySelector<HTMLInputElement>('#password')?.value
    if(username && password){
      const response = await fetch('http://localhost:3102/me-connecter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ nom_utilisateur: username, mdp: password })
      })
      const data = await response.json()
      localStorage.setItem('token', data.letoken)
      location.reload()
    }
  });

  const logoutBtn = document.querySelector<HTMLButtonElement>('#logout')
  logoutBtn?.addEventListener('click', () => {
    localStorage.removeItem('token')
    location.reload()
  });

  const datasDOM = document.querySelector<HTMLDivElement>('#datas')

  if(datasDOM){
    const allDatas = document.querySelector<HTMLLIElement>('#all-datas')
    allDatas?.addEventListener('click', async () => {
      const response = await fetch('http://localhost:3102/miels', {
        headers: {
          'Authorization': `Believe ${token}`
        }
      })
      const data = await response.json()
      datasDOM.innerHTML = `
        <h3>Tous les miels</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
       `
    });

    const oneData = document.querySelector<HTMLLIElement>('#one-data')
    oneData?.addEventListener('click', async () => {
      const response = await fetch('http://localhost:3102/miels/4', {
        headers: {
          'Authorization': `Believe ${token}`
        }
      })
      const data = await response.json()
      datasDOM.innerHTML = `
        <h3>Un miel</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
       `
    })

    const addData = document.querySelector<HTMLLIElement>('#add-data')
    addData?.addEventListener('click', async () => {
      const response = await fetch('http://localhost:3102/miels', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Believe ${token}`
        },
        body: JSON.stringify({ nom: 'Miel de test', description: 'Description de test', prix: 10 })
      })
      const data = await response.json()
      datasDOM.innerHTML = `
        <h3>Ajouter un miel</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
       `
    })

    const updateData = document.querySelector<HTMLLIElement>('#update-data')
    updateData?.addEventListener('click', async () => {
      const response = await fetch('http://localhost:3102/miels/4/prix/10', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Believe ${token}`
        },
        body: JSON.stringify({ nom: 'Miel de test à jour', description: 'Description de test à jour' })
      })
      const data = await response.json()
      datasDOM.innerHTML = `
        <h3>Miel modifié</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
       `
    })

    const deleteData = document.querySelector<HTMLLIElement>('#delete-data')
    deleteData?.addEventListener('click', async () => {
      const response = await fetch('http://localhost:3102/miels/4', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Believe ${token}`
        }
      })
      const data = await response.json()
      datasDOM.innerHTML = `
        <h3>Miel Supprimé</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
       `
    })

    const allTags = document.querySelector<HTMLLIElement>('#first-tags')
    allTags?.addEventListener('click', async () => {
      const response = await fetch('http://localhost:3102/miels?tags=bio,sapin', {
        headers: {
          'Authorization': `Believe ${token}`
        }
      })
      const data = await response.json()
      datasDOM.innerHTML = `
        <h3>Les miels #bio et #sapin</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
       `
    })

    const oneTag = document.querySelector<HTMLLIElement>('#other-tags')
    oneTag?.addEventListener('click', async () => {
      const response = await fetch('http://localhost:3102/miels?tags=bio,lavande,montagne', {
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Believe ${token}`
        }
      })
      const data = await response.json()
      datasDOM.innerHTML = `
        <h3>Les miels #bio de #lavande ou de #montagne</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
       `
    })

    const addTag = document.querySelector<HTMLLIElement>('#add-tag')
    addTag?.addEventListener('click', async () => {
      const response = await fetch('http://localhost:3102/tags', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Believe ${token}`
        },
        body: JSON.stringify({ tag: 'accacia' })
      })
      const data = await response.json()
      datasDOM.innerHTML = `
        <h3>tag ajouté</h3>
        <pre>${JSON.stringify(data, null, 2)}</pre>
       `
    })


  }

}
