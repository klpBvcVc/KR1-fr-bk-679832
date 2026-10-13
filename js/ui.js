// ===== Общий интерфейс: тема оформления и кнопка «Наверх»
// Скрипт подключается в <head> на всех страницах: сохранённая тема применяется до отрисовки страницы.

(() => {
    const root = document.documentElement;

    // Класс js позволяет скрывать кнопку «Наверх» только когда скрипт реально работает
    root.classList.add('js');

    // Применяем тему, которую посетитель выбрал раньше
    let savedTheme = null;
    try {
        savedTheme = localStorage.getItem('theme');
    } catch (error) {
        // localStorage может быть недоступен (приватный режим), тогда остаётся тема системы
    }
    if (savedTheme === 'light' || savedTheme === 'dark') {
        root.dataset.theme = savedTheme;
    }

    // Тема системы нужна, пока посетитель ничего не выбирал
    const systemDark = window.matchMedia('(prefers-color-scheme: dark)');

    function isDark() {
        return root.dataset.theme ? root.dataset.theme === 'dark' : systemDark.matches;
    }

    document.addEventListener('DOMContentLoaded', () => {
        // ----- Переключатель темы
        const themeToggle = document.querySelector('.theme-toggle');

        function syncThemeToggle() {
            if (themeToggle) {
                themeToggle.setAttribute('aria-pressed', String(isDark()));
            }
        }

        if (themeToggle) {
            themeToggle.addEventListener('click', () => {
                const nextTheme = isDark() ? 'light' : 'dark';
                root.dataset.theme = nextTheme;
                try {
                    localStorage.setItem('theme', nextTheme);
                } catch (error) {
                    // без сохранения тема просто действует до закрытия страницы
                }
                syncThemeToggle();
            });
        }

        systemDark.addEventListener('change', syncThemeToggle);
        syncThemeToggle();

        // ----- Кнопка «Наверх»: появляется, когда hero прокручен целиком
        const toTop = document.querySelector('.to-top');
        const hero = document.querySelector('.hero');
        const header = document.querySelector('.site-header');
        if (!toTop) {
            return;
        }

        function updateToTop() {
            let show;
            if (hero && header) {
                // Низ hero ушёл под шапку: первый экран пролистан полностью
                show = hero.getBoundingClientRect().bottom <= header.offsetHeight;
            } else {
                // На страницах без hero кнопка появляется после полуэкрана прокрутки
                show = window.scrollY > window.innerHeight * 0.5;
            }
            toTop.classList.toggle('to-top--visible', show);
        }

        window.addEventListener('scroll', updateToTop, { passive: true });
        window.addEventListener('resize', updateToTop);
        updateToTop();
    });
})();
