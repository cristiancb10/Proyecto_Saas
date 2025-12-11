/// <reference path="../pb_data/types.d.ts" />
migrate((app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "resetPasswordTemplate": {
      "body": "<p>Hola,</p>\n<p>Haz click en el botón de abajo para restablecer tu contraseña.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Restear contraseña</a>\n</p>\n<p><i>Si no pediste restablecer tu contraseña, puedes ignorar este correo.</i></p>\n<p>\n  Gracias,<br/>\n  Equipo de Mi Saas\n</p>"
    },
    "verificationTemplate": {
      "body": "<p>Hola,</p>\n<p>Gracias por unirte a nosotros en <strong>Mi SaaS</strong>.</p>\n<p>Haz clic en el botón de abajo para verificar tu dirección de correo electrónico.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verificar correo</a>\n</p>\n\n<p>Si no solicitaste esta verificación, puedes ignorar este mensaje.</p>\n\n<p>\n  Gracias,<br/>\n  Equipo de Mi Saas\n</p>"
    }
  }, collection)

  return app.save(collection)
}, (app) => {
  const collection = app.findCollectionByNameOrId("_pb_users_auth_")

  // update collection data
  unmarshal({
    "resetPasswordTemplate": {
      "body": "<p>Hello,</p>\n<p>Click on the button below to reset your password.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-password-reset/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Reset password</a>\n</p>\n<p><i>If you didn't ask to reset your password, you can ignore this email.</i></p>\n<p>\n  Thanks,<br/>\n  {APP_NAME} team\n</p>"
    },
    "verificationTemplate": {
      "body": "<p>Hola,</p>\n<p>Hola, gracias por unirte a nosotros en <strong>Mi SaaS</strong>.</p>\n<p>Haz clic en el botón de abajo para verificar tu dirección de correo electrónico.</p>\n<p>\n  <a class=\"btn\" href=\"{APP_URL}/_/#/auth/confirm-verification/{TOKEN}\" target=\"_blank\" rel=\"noopener\">Verificar correo</a>\n</p>\n\n<p>Si no solicitaste esta verificación, puedes ignorar este mensaje.</p>\n\n<p>\n  Gracias,<br/>\n  Equipo de Mi Saas\n</p>"
    }
  }, collection)

  return app.save(collection)
})
