document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registro-form');
    const gerarRegistroBtn = document.getElementById('gerar-registro');
    const categoriaSelect = document.getElementById('categoria');
    const camposAdicionais = document.getElementById('campos-adicionais');
    const problemaRelatadoTextarea = document.getElementById('problema-relatado');
    const tratativaTextarea = document.getElementById('tratativa');
    const registroTextarea = document.getElementById('registro-textarea');
    const registroGeradoSection = document.getElementById('registro-gerado');

    // --- Função para criar e mostrar o feedback de ERRO ---
    function showCategoryError() {
        let errorDiv = document.getElementById('category-error');

        // Se a div de erro não existir, cria.
        if (!errorDiv) {
            errorDiv = document.createElement('div');
            errorDiv.id = 'category-error';
            errorDiv.style.backgroundColor = 'red';  // Fundo vermelho para erro
            errorDiv.style.color = 'white';
            errorDiv.style.padding = '10px';
            errorDiv.style.borderRadius = '5px';
            errorDiv.style.position = 'fixed'; // Fixo
            errorDiv.style.top = '20px';
            errorDiv.style.left = '50%';
            errorDiv.style.transform = 'translateX(-50%)';
            errorDiv.style.zIndex = '1000';
            errorDiv.style.opacity = '0';
            errorDiv.style.transition = 'opacity 0.5s ease-out';
            document.body.appendChild(errorDiv);
        }

        errorDiv.textContent = 'Por favor, selecione uma categoria.';
        errorDiv.style.opacity = '1';

        // Esconde após 3 segundos
        setTimeout(() => {
            errorDiv.style.opacity = '0';
        }, 3000);
    }

     // --- Função para criar e mostrar o feedback visual ---
     function showCopyFeedback() {
        let feedbackDiv = document.getElementById('copy-feedback');

        // Se a div de feedback não existir, cria ela.
        if (!feedbackDiv) {
            feedbackDiv = document.createElement('div');
            feedbackDiv.id = 'copy-feedback';
            feedbackDiv.style.backgroundColor = 'green';
            feedbackDiv.style.color = 'white';
            feedbackDiv.style.padding = '10px';
            feedbackDiv.style.borderRadius = '5px';
            feedbackDiv.style.position = 'fixed'; // Fixo na tela
            feedbackDiv.style.top = '20px';       // Distância do topo
            feedbackDiv.style.left = '50%';      // Centralizado horizontalmente
            feedbackDiv.style.transform = 'translateX(-50%)'; // Ajuste para centralização
            feedbackDiv.style.zIndex = '1000';    // Garante que fique acima de outros elementos
            feedbackDiv.style.opacity = '0';       // Começa invisível
            feedbackDiv.style.transition = 'opacity 0.5s ease-out'; // Transição suave
            document.body.appendChild(feedbackDiv); // Adiciona ao body
        }

        feedbackDiv.textContent = 'Copiado para a área de transferência!';
        feedbackDiv.style.opacity = '1'; // Torna visível

        // Esconde o feedback após 2 segundos
        setTimeout(() => {
            feedbackDiv.style.opacity = '0';
        }, 2000);
    }

    // --- Função de cópia (alternativa, mais confiável) ---
    function copyToClipboard(text) {
        const tempTextarea = document.createElement('textarea');
        tempTextarea.value = text;
        tempTextarea.style.position = 'fixed'; // Garante que fique fora da tela
        tempTextarea.style.top = '0';
        tempTextarea.style.left = '0';
        tempTextarea.style.opacity = '0'; // Invisível
        document.body.appendChild(tempTextarea);
        tempTextarea.focus();
        tempTextarea.select();
        try {
            const successful = document.execCommand('copy');
            const msg = successful ? 'successful' : 'unsuccessful';
            console.log('Fallback: Copying text command was ' + msg);
            if(successful){
                showCopyFeedback();
            }
        } catch (err) {
            console.error('Fallback: Oops, unable to copy', err);
            alert('Erro ao copiar para a área de transferência.');
        }
        document.body.removeChild(tempTextarea); // Remove o elemento temporário
    }

    categoriaSelect.addEventListener('change', function() {
        const categoria = categoriaSelect.value;

        // Reseta os campos
        problemaRelatadoTextarea.value = '';
        tratativaTextarea.value = '';

        // Mostra os campos adicionais (sempre)
        camposAdicionais.classList.remove('hidden');

        // Preenche os campos com base na categoria (TODOS GENÉRICOS AGORA)
        switch (categoria) {
            case 'instalacao_ativacao':
                problemaRelatadoTextarea.value = 'Solicitação de instalação/ativação.';
                tratativaTextarea.value = 'Realizada instalação/ativação utilizando ERP Voalle, UNM2000 ou TERMINUS.';
                break;
            case 'manutencao':
                problemaRelatadoTextarea.value = 'Solicitação de manutenção.';
                tratativaTextarea.value = 'Realizados procedimentos de manutenção utilizando ERP Voalle, UNM2000 ou TERMINUS.';
                break;
            case 'reparo':
                problemaRelatadoTextarea.value = 'Solicitação de reparo.';
                tratativaTextarea.value = 'Identificado o problema e realizadas as medidas corretivas utilizando ERP Voalle, UNM2000 ou TERMINUS.';
                break;
            case 'troca_endereco':
                problemaRelatadoTextarea.value = 'Solicitação de troca de endereço.';
                tratativaTextarea.value = 'Realizado desprovisionamento no endereço antigo e provisionamento no novo endereço utilizando ERP Voalle, UNM2000 ou TERMINUS.';
                break;
            case 'verificar_cto':
                problemaRelatadoTextarea.value = 'Solicitação de verificação da CTO.';
                tratativaTextarea.value = 'Verificação da CTO realizada utilizando ERP Voalle, UNM2000 ou TERMINUS.';
                break;
            case 'desprovisionar_provisionar':
                problemaRelatadoTextarea.value = 'Solicitação de desprovisionamento e provisionamento.';
                tratativaTextarea.value = 'Desprovisionamento e provisionamento realizados utilizando ERP Voalle, UNM2000 ou TERMINUS.';
                break;
            case 'verificar_conexao':
                problemaRelatadoTextarea.value = 'Solicitação de verificação de conexão.';
                tratativaTextarea.value = 'Verificação de conexão realizada, com análise de parâmetros, utilizando ERP Voalle, UNM2000 ou TERMINUS.';
                break;
            case 'apenas_desprovisionar':
                problemaRelatadoTextarea.value = 'Solicitação de desprovisionamento.';
                tratativaTextarea.value = 'Desprovisionamento realizado utilizando ERP Voalle, UNM2000 ou TERMINUS.';
                break;
            case 'apenas_provisionar':
                problemaRelatadoTextarea.value = 'Solicitação de provisionamento.';
                tratativaTextarea.value = 'Provisionamento realizado utilizando ERP Voalle, UNM2000 ou TERMINUS.';
                break;
            default:
                //Se nenhuma categoria for selecionada, oculta novamente (opcional)
                camposAdicionais.classList.add('hidden');
        }
    });

      gerarRegistroBtn.addEventListener('click', function() {
        const protocolo = document.getElementById('protocolo').value;
        const categoria = categoriaSelect.value;

        // Validação da categoria (agora com a div de erro)
        if (!protocolo || categoria === '') { // Verifica se protocolo está vazio OU categoria é vazia
            showCategoryError(); // Mostra a mensagem de erro
            return; // Interrompe a execução da função
        }

        const evidencias = document.querySelector('input[name="evidencias"]:checked');
        const evidenciasStr = evidencias ? evidencias.value.toUpperCase() : '';

        let registroCompleto = `Protocolo Operações: ${protocolo}\n\nProblema Relatado: ${problemaRelatadoTextarea.value}\n\nTratativa: ${tratativaTextarea.value}\n\nTécnico/solicitante enviou evidências: ${evidenciasStr}`;

        registroTextarea.value = registroCompleto;
        registroGeradoSection.style.display = 'block';

        // Copia para a área de transferência e mostra o feedback (CORRIGIDO)
        copyToClipboard(registroCompleto);
    });
});