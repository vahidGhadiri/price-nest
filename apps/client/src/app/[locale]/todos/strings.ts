import { defineMessages } from '@configs/i18n';

export default defineMessages({
    title: {
        defaultMessage: {
            ar: 'المهام',
            en: 'Todos',
            fa: 'تسک‌ها',
        },
        id: 'todos/title',
    },

    description: {
        defaultMessage: {
            ar: 'إدارة مهامك',
            en: 'Manage your tasks',
            fa: 'تسک‌هاتو مدیریت کن',
        },
        id: 'todos/description',
    },

    placeholder: {
        defaultMessage: {
            ar: 'ماذا يجب فعله؟',
            en: 'What needs to be done?',
            fa: 'چه کاری باید انجام بشه؟',
        },
        id: 'todos/placeholder',
    },

    adding: {
        defaultMessage: {
            ar: 'جاري الإضافة...',
            en: 'Adding...',
            fa: 'در حال اضافه کردن...',
        },
        id: 'todos/adding',
    },

    add: {
        defaultMessage: {
            ar: 'إضافة',
            en: 'Add',
            fa: 'افزودن',
        },
        id: 'todos/add',
    },

    empty: {
        defaultMessage: {
            ar: 'لا توجد مهام بعد. أضف واحدة أعلاه.',
            en: 'No todos yet. Add one above.',
            fa: 'هنوز تسکی نیست. یکی اضافه کن.',
        },
        id: 'todos/empty',
    },
});
