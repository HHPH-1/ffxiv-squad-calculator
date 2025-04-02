document.addEventListener('DOMContentLoaded', function() {
    // 职业选择项
    const jobOptions = [
        '斧术师', '剑术师', '弓箭手', '双剑师', 
        '枪术师', '格斗家', '幻术师', '咒术师', '秘术师'
    ];
    
    // 初始化队员行
    const heroesContainer = document.querySelector('.heroes-container');
    let heroCount = 0;
    const MAX_HEROES = 8; // 设置最大队员数量为8

    // 添加初始的8个队员
    for (let i = 0; i < 8; i++) {
        addHeroRow();
    }

    // 初始化必选队员复选框
    updateMustUseOptions();
    
    // 由于已经有8个队员，隐藏添加按钮
    updateAddHeroButtonVisibility();

    // 添加队员行函数
    function addHeroRow() {
        // 检查是否已达到上限
        if (document.querySelectorAll('.hero-row').length >= MAX_HEROES) {
            return;
        }
        
        heroCount++;
        const heroRow = document.createElement('div');
        heroRow.className = 'hero-row';
        heroRow.dataset.id = heroCount;
        
        heroRow.innerHTML = `
            <span>${heroCount}. </span>
            <select class="hero-job">
                ${jobOptions.map(job => `<option value="${job}">${job}</option>`).join('')}
            </select>
            <input type="number" class="hero-level" min="1" max="60" value="60">
            <button class="remove-hero">删除</button>
        `;
        
        heroesContainer.appendChild(heroRow);
        
        // 添加删除事件监听
        heroRow.querySelector('.remove-hero').addEventListener('click', function() {
            heroRow.remove();
            updateHeroNumbers();
            updateMustUseOptions();
            updateAddHeroButtonVisibility();
        });

        // 更新必选队员选项
        updateMustUseOptions();
        // 检查并更新添加按钮状态
        updateAddHeroButtonVisibility();
    }

    // 更新添加队员按钮的可见性
    function updateAddHeroButtonVisibility() {
        const addHeroBtn = document.getElementById('addHero');
        const currentHeroCount = document.querySelectorAll('.hero-row').length;
        
        if (currentHeroCount >= MAX_HEROES) {
            addHeroBtn.disabled = true;
            addHeroBtn.classList.add('disabled');
            addHeroBtn.title = '最多只能添加8个队员';
        } else {
            addHeroBtn.disabled = false;
            addHeroBtn.classList.remove('disabled');
            addHeroBtn.title = '';
        }
    }

    // 更新队员编号
    function updateHeroNumbers() {
        const heroRows = document.querySelectorAll('.hero-row');
        heroRows.forEach((row, index) => {
            row.dataset.id = index + 1;
            row.querySelector('span').textContent = `${index + 1}. `;
        });
    }

    // 更新必选队员选项
    function updateMustUseOptions() {
        const mustUseContainer = document.getElementById('must-use-container');
        mustUseContainer.innerHTML = '';
        
        const heroRows = document.querySelectorAll('.hero-row');
        
        const checkboxContainer = document.createElement('div');
        checkboxContainer.className = 'checkbox-container';
        
        heroRows.forEach(row => {
            const id = row.dataset.id;
            const jobSelect = row.querySelector('.hero-job');
            const job = jobSelect.value;
            
            const checkboxItem = document.createElement('div');
            checkboxItem.className = 'checkbox-item';
            checkboxItem.innerHTML = `
                <input type="checkbox" id="must-use-${id}" value="${id}">
                <label for="must-use-${id}">${id}号${job}</label>
            `;
            
            checkboxContainer.appendChild(checkboxItem);
            
            // 更新职业变更监听
            jobSelect.addEventListener('change', function() {
                updateMustUseOptions();
            });
        });
        
        mustUseContainer.appendChild(checkboxContainer);
    }

    // 添加队员按钮事件
    document.getElementById('addHero').addEventListener('click', addHeroRow);

    // 训练点数总和计算
    const trainingInputs = document.querySelectorAll('[id^="training-"]');
    trainingInputs.forEach(input => {
        input.addEventListener('input', updateTrainingTotal);
    });

    function updateTrainingTotal() {
        const values = [
            parseInt(document.getElementById('training-0').value) || 0,
            parseInt(document.getElementById('training-1').value) || 0,
            parseInt(document.getElementById('training-2').value) || 0
        ];
        
        const total = values.reduce((sum, val) => sum + val, 0);
        document.getElementById('training-total').textContent = total;
        
        // 检查总和是否有效
        const validTotals = [200, 280, 400];
        if (validTotals.includes(total)) {
            document.getElementById('training-total').style.color = '#3a78c5';
        } else {
            document.getElementById('training-total').style.color = '#e74c3c';
        }
    }

    // 任务列表管理
    const missionsList = document.getElementById('missions-list');
    let missions = []; // 不设置默认任务

    function updateMissionsList() {
        missionsList.innerHTML = '';
        missions.forEach((mission, index) => {
            const missionItem = document.createElement('div');
            missionItem.className = 'mission-item';
            missionItem.innerHTML = `
                <span>任务 ${index + 1}: [体能: ${mission[0]}, 心智: ${mission[1]}, 战术: ${mission[2]}]</span>
                <button class="remove-mission" data-index="${index}">删除</button>
            `;
            missionsList.appendChild(missionItem);
        });

        // 添加删除事件监听
        document.querySelectorAll('.remove-mission').forEach(btn => {
            btn.addEventListener('click', function() {
                const index = parseInt(this.dataset.index);
                missions.splice(index, 1);
                updateMissionsList();
            });
        });
    }

    // 初始化任务列表
    updateMissionsList();

    // 添加任务按钮事件
    document.getElementById('addMission').addEventListener('click', function() {
        setNewMission();
    });

    // 确认任务按钮事件
    document.getElementById('confirmMission').addEventListener('click', function() {
        // 确保所有任务输入框都有值
        if (missionInputs.every(inp => inp.value && inp.value.trim() !== '')) {
            addCurrentMission();
        }
    });

    // 为任务属性输入框添加输入事件监听
    const missionInputs = [
        document.getElementById('mission-0'),
        document.getElementById('mission-1'),
        document.getElementById('mission-2')
    ];

    // 添加当前任务到列表
    function addCurrentMission() {
        const missionValues = [
            parseInt(document.getElementById('mission-0').value) || 0,
            parseInt(document.getElementById('mission-1').value) || 0,
            parseInt(document.getElementById('mission-2').value) || 0
        ];
        
        missions.push(missionValues);
        updateMissionsList();
    }

    // 设置新任务（清空当前输入框）
    function setNewMission() {
        document.getElementById('mission-0').value = '';
        document.getElementById('mission-1').value = '';
        document.getElementById('mission-2').value = '';
        document.getElementById('mission-0').focus();
    }

    // 计算按钮事件
    document.getElementById('calculate').addEventListener('click', function() {
        // 1. 获取队员信息
        const heroes = [];
        document.querySelectorAll('.hero-row').forEach((row, index) => {
            heroes.push({
                name: row.querySelector('.hero-job').value,
                level: parseInt(row.querySelector('.hero-level').value)
            });
        });

        // 2. 获取训练点数
        const trainingPoints = [
            parseInt(document.getElementById('training-0').value) || 0,
            parseInt(document.getElementById('training-1').value) || 0,
            parseInt(document.getElementById('training-2').value) || 0
        ];

        // 3. 获取展示结果数
        const resultCount = parseInt(document.getElementById('result-count').value) || 0;

        // 4. 获取必选队员
        const mustUsed = [];
        document.querySelectorAll('#must-use-container input:checked').forEach(checkbox => {
            mustUsed.push(parseInt(checkbox.value));
        });

        // 5. 调用计算器算法
        const resultsEl = document.getElementById('results');
        resultsEl.textContent = '计算中...';

        // 重定向console.log到results元素
        const originalConsoleLog = console.log;
        const logs = [];
        
        console.log = function() {
            logs.push(Array.from(arguments).join(' '));
            resultsEl.textContent = logs.join('\n');
        };

        // 调用计算器函数
        calculateMissions(heroes, missions, trainingPoints, resultCount, mustUsed);

        // 恢复console.log
        console.log = originalConsoleLog;
    });
}); 