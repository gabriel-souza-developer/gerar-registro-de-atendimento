document.addEventListener('DOMContentLoaded', function() {
    // Elementos do DOM
    const form = document.getElementById('registro-form');
    const gerarRegistroBtn = document.getElementById('gerar-registro');
    const categoriaSelect = document.getElementById('categoria');
    const camposAdicionais = document.getElementById('campos-adicionais');
    const problemaRelatadoTextarea = document.getElementById('problema-relatado');
    const tratativaTextarea = document.getElementById('tratativa');
    const registroTextarea = document.getElementById('registro-textarea');
    const registroGeradoSection = document.getElementById('registro-gerado');

    // Funções auxiliares

    // Exibe mensagens de feedback (erro ou sucesso)
    function showFeedback(message, backgroundColor) {
        let feedbackDiv = document.getElementById('feedback-message');
        if (!feedbackDiv) {
            feedbackDiv = document.createElement('div');
            feedbackDiv.id = 'feedback-message';
            feedbackDiv.style.cssText = `
                background-color: ${backgroundColor};
                color: white;
                padding: 10px;
                border-radius: 5px;
                position: fixed;
                top: 20px;
                left: 50%;
                transform: translateX(-50%);
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.5s ease-out;
            `;
            document.body.appendChild(feedbackDiv);
        }

        feedbackDiv.textContent = message;
        feedbackDiv.style.opacity = '1';

        setTimeout(() => {
            feedbackDiv.style.opacity = '0';
        }, 3000);
    }

    // Copia texto para a área de transferência
    function copyToClipboard(text) {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = text;
        tempTextarea.style.position = 'fixed'; // Para não interferir no layout
        tempTextarea.style.top = '0';
        tempTextarea.style.left = '0';
        tempTextarea.style.opacity = '0';
        document.body.appendChild(tempTextarea);
        tempTextarea.focus();
        tempTextarea.select();

        try {
            document.execCommand('copy');
            showFeedback('Copiado para a área de transferência!', 'green');
        } catch (err) {
            console.error('Falha ao copiar: ', err);
            showFeedback('Erro ao copiar para a área de transferência.', 'red');
        }

        document.body.removeChild(tempTextarea);
    }

    // Define os valores padrão para o problema relatado e a tratativa
    function setCategoryDefaults(categoria) {
        const defaults = {
            instalacao_ativacao: { problema: 'Solicitação de instalação/ativação.', tratativa: 'Realizada instalação/ativação/provisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento o técnico/solicitante foi orientado a testar conexão do cliente.' },
            manutencao: { problema: 'Solicitação de manutenção.', tratativa: 'Realizados procedimentos para atendimento de manutenção utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento o técnico/solicitante foi orientado a testar conexão do cliente.' },
            reparo: { problema: 'Solicitação de reparo.', tratativa: 'Identificado o problema e realizadas as medidas corretivas (provisionamento/desprovisionamento) utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento o técnico/solicitante foi orientado a testar conexão do cliente.' },
            troca_endereco: { problema: 'Solicitação de troca de endereço.', tratativa: 'Realizado desprovisionamento da ONU/ONT no endereço antigo e provisionamento da ONU/ONT em novo endereço utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento o técnico/solicitante foi orientado a testar conexão do cliente.' },
            verificar_cto: { problema: 'Solicitação de verificação da CTO.', tratativa: 'Verificação da CTO realizada utilizando ERP Voalle, UNM2000 ou TERMINUS. Técnico foi informado sobre as portas disponíveis e indisponíveis da CTO' },
            desprovisionar_provisionar: { problema: 'Solicitação de desprovisionamento e provisionamento da ONU/ONT.', tratativa: 'Desprovisionamento e provisionamento realizados utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento o técnico/solicitante foi orientado a testar conexão do cliente.' },
            verificar_conexao: { problema: 'Solicitação de verificação de conexão.', tratativa: 'Verificação de conexão realizada com análise de parâmetros e orientações de testes como: Reiniciar ONU/ONT e aguarda a estabilização dos LEDs, verificar se as configurações da WAN estão corretas (modo bridge ou router, autenticação PPPoE com IPv4 & IPv6), medir o nível de sinal de potência óptica, conferência de atenunação na fibra, testes de conexão com cabo Ehternet ou Wi-fi, análise de histórico de autenticação do cliente... As orientações foram repassadas ao técnico utilizando ERP Voalle, UNM2000 ou TERMINUS.' },
            apenas_desprovisionar: { problema: 'Solicitação de desprovisionamento.', tratativa: 'Desprovisionamento realizado utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento o técnico/solicitante foi orientado a testar conexão do cliente.' },
            apenas_provisionar: { problema: 'Solicitação de provisionamento.', tratativa: 'Provisionamento realizado utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento o técnico/solicitante foi orientado a testar conexão do cliente.' }
        };

        problemaRelatadoTextarea.value = defaults[categoria]?.problema || '';
        tratativaTextarea.value = defaults[categoria]?.tratativa || '';
    }


    // Listeners de eventos

    // Ao mudar a categoria, define os valores padrão do problema/tratativa
    categoriaSelect.addEventListener('change', function() {
        const categoria = categoriaSelect.value;
        setCategoryDefaults(categoria); // Define os valores padrão
        camposAdicionais.classList.toggle('hidden', categoria === ''); // Mostra/esconde campos adicionais
    });

    // Ao clicar em gerar o registro
    gerarRegistroBtn.addEventListener('click', function() {
        const protocolo = document.getElementById('protocolo').value;
        const categoria = categoriaSelect.value;

        if (!protocolo || categoria === '') {
            showFeedback('Por favor, preencha o protocolo e selecione uma categoria.', 'red');
            return;
        }

        const evidencias = document.querySelector('input[name="evidencias"]:checked');
        const evidenciasStr = evidencias ? evidencias.value.toUpperCase() : '';

        let registroCompleto = `Protocolo de operações: ${protocolo}\n\nProblema relatado: ${problemaRelatadoTextarea.value}\n\nTratativa: ${tratativaTextarea.value}\n\nTécnico/solicitante enviou evidências: ${evidenciasStr}`;

        registroTextarea.value = registroCompleto;
        registroGeradoSection.style.display = 'block';

        copyToClipboard(registroCompleto);
    });
});