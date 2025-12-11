/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "verificationTemplate": {
      "body": "<p>Hola,</p>\n<p>Hola, gracias por unirte a nosotros en <strong>Mi SaaS</strong>.</p>\n<p>Haz clic en el botón de abajo para verificar tu dirección de correo electrónico.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verificar correo</a>\n</p>\n\n<p>Si no solicitaste esta verificación, puedes ignorar este mensaje.</p>\n\n<p>\n  Gracias,<br/>\n  Equipo de Mi Saas\n</p>"
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "verificationTemplate": {
      "body": "<p>Hola,</p>\n<p>Hola, gracias por unirte a nosotros en Mi SaaS.</p>\n<p>Haz clic en el botón de abajo para verificar tu dirección de correo electrónico.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verify</a>\n</p>\n<p>\n  Gracias,<br/>\n  Equipo de Mi Saas\n</p>"
    }
  }, collection)

  return app.save(collection)
})
