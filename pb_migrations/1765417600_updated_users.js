/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "resetPasswordTemplate": {
      "body": "<p>Hola,</p>\n<p>Haz click en el botón de abajo para restablecer tu contraseña.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Resetear contraseña</a>\n</p>\n<p><i>Si no pediste restablecer tu contraseña, puedes ignorar este correo.</i></p>\n<p>\n  Gracias,<br/>\n  Equipo de Mi Saas\n</p>"
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "resetPasswordTemplate": {
      "body": "<p>Hola,</p>\n<p>Haz click en el botón de abajo para restablecer tu contraseña.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Restear contraseña</a>\n</p>\n<p><i>Si no pediste restablecer tu contraseña, puedes ignorar este correo.</i></p>\n<p>\n  Gracias,<br/>\n  Equipo de Mi Saas\n</p>"
    }
  }, collection)

  return app.save(collection)
})
