# Votação Ave Símbolo de São Sebastião — Festival Entre Asas

Aplicação web interativa, visual e responsiva para a eleição da Ave Símbolo do município de São Sebastião/SP, realizada durante o Festival de Observação de Aves Entre Asas com apoio da Secretaria de Turismo (SETUR).

---

## 1. Visão Geral e Experiência do Usuário

A plataforma foi projetada para oferecer uma experiência imersiva e educativa:
* **Galeria de Candidatas:** Grid com as 6 espécies de aves nativas em destaque, fotos em alta definição, nome popular e nome científico.
* **Modal de Detalhes:** Apresentação da justificativa completa ("Por que votar nesta espécie?"), características morfológicas, importância para o ecossistema e ligação com a cultura caiçara.
* **Seleção Dinâmica e Fluida:** Destaque visual ao escolher uma ave e direcionamento automático para a área de confirmação.
* **Regra de Voto Único:** Validação rígida de e-mail tanto no cliente quanto no backend do Google Sheets, impedindo votos duplicados com o mesmo endereço eletrônico.
* **Sem Emojis e Paleta Natural:** Identidade visual inspirada na Mata Atlântica e no litoral (azul mar profundo, verde floresta e toques ambarinos), sem uso de tons roxos ou elementos informais.

---

## 2. Espécies Candidatas

1. **Beija-flor-rajado** (*Ramphodon naevius*)
2. **Surucuá-de-barriga-amarela** (*Trogon viridis*)
3. **Pintadinho** (*Drymophila squamata*)
4. **Tucano-de-bico-preto** (*Ramphastos vitellinus*)
5. **Garça-branca-grande** (*Ardea alba*)
6. **Jaó-do-sul** (*Crypturellus noctivagus*)

---

## 3. Estrutura do Projeto

```
Votacao Ave Simbolo/
├── assets/                          # Imagens em alta definição e logo oficial
│   ├── logo-entre-asas.png
│   ├── beija-flor-rajado.jpg
│   ├── surucua-de-barriga-amarela.jpg
│   ├── pintadinho.jpg
│   ├── tucano-de-bico-preto.jpg
│   ├── garca-branca-grande.jpg
│   └── jao-do-sul.jpg
├── backend/
│   └── Code.gs                      # Backend do Google Apps Script
├── index.html                       # Estrutura HTML principal
├── styles.css                       # Estilização visual completa e responsiva
├── app.js                           # Lógica de interação, validação e envio
├── README.md                        # Documentação do projeto
└── .gitignore                       # Arquivos ignorados pelo Git
```

---

## 4. Integração com o Google Sheets

Para conectar o formulário à sua planilha Google:

1. Acesse o [Google Sheets](https://sheets.google.com) e crie uma nova planilha (ou abra uma existente).
2. Vá em **Extensões** > **Apps Script**.
3. Cole o conteúdo do arquivo `backend/Code.gs` no editor de script.
4. Clique em **Implantar** > **Nova implantação**:
   * Tipo: **Web App**.
   * Executar como: **Você**.
   * Quem tem acesso: **Qualquer pessoa**.
5. Copie a **URL do Web App** gerada.
6. No arquivo `app.js`, insira a URL na variável `CONFIG.WEB_APP_URL`:
   ```javascript
   const CONFIG = {
     WEB_APP_URL: 'https://script.google.com/macros/s/SUA_URL_AQUI/exec',
     STORAGE_KEY_VOTE: 'setur_ave_simbolo_voto_registrado',
   };
   ```

Toda resposta recebida criará automaticamente a aba `Votos_Ave_Simbolo` na planilha com auditoria de Data/Hora, E-mail, Ave Votada, Nome Científico, IP e Dispositivo.
