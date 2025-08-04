document.addEventListener('DOMContentLoaded', function () {
    // Elementos do DOM
    const form = document.getElementById('registro-form');
    const gerarRegistroBtn = document.getElementById('gerar-registro');
    const categoriaSelect = document.getElementById('categoria');
    const camposAdicionais = document.getElementById('campos-adicionais');
    const problemaRelatadoTextarea = document.getElementById('problema-relatado');
    const tratativaTextarea = document.getElementById('tratativa');
    const registroTextarea = document.getElementById('registro-textarea');
    const registroGeradoSection = document.getElementById('registro-gerado');

    // Exibe feedback visual na tela
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
        feedbackDiv.style.backgroundColor = backgroundColor;
        feedbackDiv.style.opacity = '1';

        setTimeout(() => {
            feedbackDiv.style.opacity = '0';
        }, 3000);
    }

    // Copia texto para a área de transferência
    function copyToClipboard(text) {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = text;
        tempTextarea.style.position = 'fixed';
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
            instalacao_ativacao: {
                problema: 'Solicitação de instalação/ativação.',
                tratativa: 'Realizada instalação/ativação e provisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS.  Após os procedimentos, a conexão do cliente foi estabelecida com sucesso e o técnico/solicitante foi orientado a realizar testes no local.'
            },
            sem_acesso: {
                problema: 'Solicitação de reparo/manutenção.',
                tratativa: 'Realizados os procedimentos de reparo/manutenção, incluindo testes e configurações, utilizando ERP Voalle, UNM2000 ou TERMINUS. Foi confirmado que a conexão do cliente ficou estável e funcional após os ajustes.'
            },
            troca_endereco: {
                problema: 'Solicitação de troca de endereço.',
                tratativa: 'Realizado o desprovisionamento da ONU/ONT no endereço antigo e o provisionamento da ONU/ONT no novo endereço utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento foi constatado que a conexão do cliente subiu em sistema e o técnico/solicitante foi orientado a testar conexão no local.'
            },
            troca_equipamento: {
                problema: 'Solicitação de troca de equipamento (desprovisionamento e provisionamento de nova ONU/ONT).',
                tratativa: 'Realizado o desprovisionamento e, em seguida, o provisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS. Após os procedimentos, a conexão do cliente foi restabelecida com sucesso e o técnico/solicitante foi orientado a realizar testes no local.'
            },
            verificar_cto: {
                problema: 'Solicitação de verificação da CTO - Caixa de Terminação Óptica.',
                tratativa: 'Verificação da CTO realizada, identificando as portas disponíveis e indisponíveis. As informações foram repassadas ao técnico para as devidas providências e testes. Segue resumo da análise/verificação: \n\n '
            },
            desprovisionar_provisionar: {
                problema: 'Solicitação de desprovisionamento e provisionamento da ONU/ONT.',
                tratativa: 'Realizado o desprovisionamento e o provisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento, a conexão do cliente foi estabelecida com sucesso no sistema e o técnico/solicitante foi orientado a testar a conexão no local.'
            },
            analise_backoffice: {
                problema: 'Solicitação de análise do BackOffice - BA.',
                tratativa: 'Realizada análise da situação do cliente através do protocolo, verificando configurações, histórico de atendimentos e outros dados relevantes. Identificada a necessidade de desautorização e e autorização da ONU/ONT por meio das ferramentas ERP Voalle, UNM2000 ou TERMINUS. \n\nApós os procedimentos a conexão do cliente foi restabelecida e validada (IP disponível) em sistema.'
            },
            verificar_conexao: {
                problema: 'Solicitação de análise de conexão do cliente.',
                tratativa: 'Realizada análise de conexão do cliente, incluindo: análise de parâmetros (nível de sinal óptico ideal entre -5dBm e -25dBm, taxa de transmissão e perdas de pacotes); testes de conectividade (ping para servidores externos e traceroute para identificar possíveis gargalos); verificação das configurações da WAN (modo de operação: bridge ou router, autenticação PPPoE com usuário e senha, e configuração de DNS para 8.8.8.8 e 1.0.0.1); análise do histórico de autenticação (horários de conexão, desconexões frequentes e erros de autenticação); e reinicialização/reset dos equipamentos (reboot da ONU/ONT e estabilização dos LEDs). \n\nAs orientações e os resultados foram repassados ao técnico para auxiliar na solução do problema.'
            },
            ipdedicado: {
                problema: 'Solicitação de atribuição de IP fixo/dedicado ao cliente',
                tratativa: 'Realizada fixação de IP fixo/dedicado com base no range correspondente à região e OLT/região do cliente utilizando as ferramentas ERP Voalle, UNM200 ou TERMINUS. Informações da conexão e IP foram repassadas ao solicitante/técnico responsável.'
            },
            redirecionamento_portas: {
                problema: 'Solicitação para redirecionamento ou liberação de portas específicas na ONU/ONT.',
                tratativa: 'Executado o redirecionamento/liberação das portas conforme solicitado, utilizando as ferramentas ERP Voalle, UNM200 ou TERMINUS. Foram realizados testes de conectividade e as informações de liberação foram comunicadas ao solicitante/técnico responsável.'
            },
            plano_contratado_entregue: {
                problema: 'Cliente/solicitante relatou divergência entre o plano contratado e o plano atualmente entregue (velocidade, franquia ou perfil aplicado).',
                tratativa: 'Cliente/solicitante relatou divergência entre o plano contratado e o plano entregue. Foi identificada a discrepância e realizada a regularização do perfil de velocidade/plano por meio das ferramentas ERP Voalle, UNM200 ou TERMINUS, conforme a tecnologia e OLT correspondente. Adicionalmente, foi realizada a verificação da conexão do cliente, incluindo: análise de parâmetros (nível de sinal óptico ideal entre -16 dBm e -24 dBm, taxa de transmissão e perdas de pacotes); testes de conectividade (ping para servidores externos e traceroute para identificar possíveis gargalos); verificação das configurações da WAN (modo de operação: bridge ou router, autenticação PPPoE com usuário e senha, e configuração de DNS para 8.8.8.8 e 1.0.0.1); análise do histórico de autenticação (horários de conexão, desconexões frequentes e erros de autenticação); e reinicialização/reset dos equipamentos (reboot da ONU/ONT e estabilização dos LEDs).\n\nTodas as informações, resultados dos testes e orientações foram repassadas ao solicitante/técnico responsável para continuidade no atendimento.'
            },
            apenas_desprovisionar: {
                problema: 'Solicitação de apenas desprovisionar a ONU/ONT.',
                tratativa: 'Realizado o desprovisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS. Foi confirmado o desprovisionamento e repassado ao técnico.'
            },
            apenas_provisionar: {
                problema: 'Solicitação de apenas provisionamento da ONU/ONT.',
                tratativa: 'Realizado o provisionamento da ONU/ONT utilizando ERP Voalle, UNM2000 ou TERMINUS. Após o procedimento, a conexão foi estabelecida com sucesso no sistema e o técnico/solicitante foi orientado a testar a conexão no local.'
            },
            oscilacao: {
                problema: "Solicitação de análise de conexão. Cliente informa que há perdas de pacotes frequentemente e muita lentidão.",
                tratativa: "Realizada a verificação da conexão do cliente, incluindo: análise de parâmetros (nível de sinal óptico ideal entre -16dBm e -24dBm, taxa de transmissão e perdas de pacotes); testes de conectividade (ping para servidores externos e traceroute para identificar possíveis gargalos); verificação das configurações da WAN (modo de operação: bridge ou router, autenticação PPPoE com usuário e senha, e configuração de DNS para 8.8.8.8 e 1.0.0.1); análise do histórico de autenticação (horários de conexão, desconexões frequentes e erros de autenticação); e reinicialização/reset dos equipamentos (reboot da ONU/ONT e estabilização dos LEDs). As orientações e os resultados foram repassados ao técnico para auxiliar na solução do problema. Além disso, foi repassada para o técnico as seguintes informações: \n\nNos últimos dias, clientes de diversas regiões do Nordeste podem ter percebido oscilações no serviço de internet, como lentidão, quedas rápidas ou dificuldade de acesso a alguns sites. Essas situações estão sendo tratadas com prioridade pela equipe técnica interna. Estamos acompanhando essas oscilações, que têm afetado não apenas nossos serviços, mas também outros provedores da região. A equipe técnica segue monitorando de forma contínua para minimizar os impactos e garantir a estabilidade da conexão."
            },
            autenticar_PPPoE: {
                problema: "Solicitação de análise de autenticação PPPoE/senha na base de dados.",
                tratativa: "Realizada verificação e feitas modificações necessárias para que seja feita autenticação de conexão via PPPoE e senha. Dados repassados para o técnico/solicitante. Após o procedimento, a conexão foi estabelecida com sucesso no sistema e o técnico/solicitante foi orientado a testar a conexão no local."
            }
        };

        problemaRelatadoTextarea.value = defaults[categoria]?.problema || '';
        tratativaTextarea.value = defaults[categoria]?.tratativa || '';
    }

    // Ao mudar a categoria, define os valores padrão do problema/tratativa
    categoriaSelect.addEventListener('change', function () {
        const categoria = categoriaSelect.value;
        setCategoryDefaults(categoria);
        camposAdicionais.classList.toggle('hidden', categoria === '');
    });

    // Geração do registro final
    gerarRegistroBtn.addEventListener('click', function () {
        const protocolo = document.getElementById('protocolo').value.trim();
        const categoria = categoriaSelect.value;
        const evidencias = document.querySelector('input[name="evidencias"]:checked');
        const problema = problemaRelatadoTextarea.value.trim();
        const tratativa = tratativaTextarea.value.trim();

        if (!protocolo || categoria === '') {
            showFeedback('Por favor, preencha o protocolo e selecione uma categoria.', 'red');
            return;
        }

        let registroCompleto = `Protocolo de operações: ${protocolo}\n\nProblema relatado: ${problema}\n\nTratativa: ${tratativa}`;

        if (categoria !== 'analise_backoffice') {
            const evidenciasStr = evidencias ? evidencias.value.toUpperCase() : '';
            registroCompleto += `\n\nTécnico/solicitante enviou evidências: ${evidenciasStr}`;
        }

        registroTextarea.value = registroCompleto;
        registroGeradoSection.style.display = 'block';

        copyToClipboard(registroCompleto);
    });
});
