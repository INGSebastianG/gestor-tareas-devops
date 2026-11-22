// Pipeline de integración continua del gestor de tareas (Entrega semana 5).
// Funciona en Windows (bat) y en Linux/macOS (sh): la función run() elige sola.

def run(String comando) {
  if (isUnix()) {
    sh comando
  } else {
    bat comando
  }
}

pipeline {
  agent any

  // Jenkins revisa GitHub cada ~2 minutos y construye solo si hay commits nuevos.
  triggers {
    pollSCM('H/2 * * * *')
  }

  options {
    timestamps()
    timeout(time: 15, unit: 'MINUTES')
    disableConcurrentBuilds()   // dos construcciones a la vez chocarían en el mismo puerto
  }

  environment {
    // Nombre propio para los contenedores de Jenkins, para no chocar
    // con los que tengas levantados a mano.
    COMPOSE_PROJECT_NAME = 'gestor-tareas-ci'
    APP_PORT = '3099'
    DB_USER = 'tareas'
    DB_NAME = 'tareas'
    // La clave NO está aquí: se guarda en Jenkins como credencial "Secret text"
    // con el id tareas-db-password, y Jenkins la oculta en los logs (****).
    DB_PASSWORD = credentials('tareas-db-password')
    ETAPA = 'inicio'
  }

  stages {
    stage('Obtener codigo') {
      steps {
        script { env.ETAPA = 'Obtener codigo' }
        checkout scm
      }
    }

    stage('Construir imagen') {
      steps {
        script { env.ETAPA = 'Construir imagen' }
        run 'docker compose build'
      }
    }

    stage('Levantar contenedores') {
      steps {
        script { env.ETAPA = 'Levantar contenedores' }
        // --wait espera a que ambos contenedores estén "healthy".
        run 'docker compose up -d --wait'
        run 'docker compose ps'
      }
    }

    stage('Operacion de ejemplo') {
      steps {
        script { env.ETAPA = 'Operacion de ejemplo' }
        // Si el resultado no es el esperado, el script sale con código 1
        // y Jenkins marca la construcción como FALLIDA.
        run 'docker compose exec -T app node scripts/operacion-ejemplo.js'
      }
    }
  }

  post {
    failure {
      echo "La construccion FALLO en la etapa: ${env.ETAPA}"
      run 'docker compose logs --no-color --tail=50'
    }
    success {
      echo 'Construccion exitosa: la operacion de ejemplo dio el resultado esperado.'
    }
    // Se ejecuta SIEMPRE (pase o falle): retira contenedores, red y volumen.
    always {
      run 'docker compose down -v --remove-orphans'
    }
  }
}
