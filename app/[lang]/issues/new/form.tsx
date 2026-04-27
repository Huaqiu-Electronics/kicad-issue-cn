'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useI18n } from '@/app/hooks/useI18n';
import { useTheme } from '@/components/ui/ThemeContext';
import Editor from 'react-markdown-editor-lite';
import 'react-markdown-editor-lite/lib/index.css';
import { marked } from 'marked';

// RenderHTML function for the markdown editor
const renderHTML = (text: string) => {
  return marked.parse(text);
};

interface NewIssueFormProps {
  user: any;
  lang: string;
  issuableTemplate?: string;
  issueDescription?: string;
}

export default function NewIssueForm({ user, lang, issuableTemplate, issueDescription }: NewIssueFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('default');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const router = useRouter();
  const { t } = useI18n();
  const { computedTheme } = useTheme();

  // Add custom styles for the markdown editor to support dark/light themes
  useEffect(() => {
    // Remove existing style if it exists
    const existingStyle = document.getElementById('markdown-editor-styles');
    if (existingStyle) {
      existingStyle.remove();
    }

    // Create new style element
    const style = document.createElement('style');
    style.id = 'markdown-editor-styles';
    style.textContent = `
      /* Markdown editor light theme */
      .md-editor {
        --text-color: #374151;
        --bg-color: #ffffff;
        --border-color: #e5e7eb;
        --toolbar-bg: #f9fafb;
        --toolbar-border: #e5e7eb;
      }

      .md-editor .editor-container {
        border-color: var(--border-color) !important;
      }

      .md-editor .editor-toolbar {
        background-color: var(--toolbar-bg) !important;
        border-color: var(--toolbar-border) !important;
      }

      .md-editor .editor-toolbar button {
        color: var(--text-color) !important;
      }

      .md-editor .editor-content {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
      }

      .md-editor .editor-content textarea {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
      }

      .md-editor .editor-preview {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
      }

      .md-editor .editor-preview pre {
        background-color: #f3f4f6 !important;
        color: var(--text-color) !important;
      }

      .md-editor .editor-preview code {
        background-color: #e5e7eb !important;
        color: var(--text-color) !important;
      }

      .md-editor .editor-preview blockquote {
        border-left: 4px solid #e5e7eb !important;
        color: var(--text-color) !important;
      }

      /* Markdown editor dark theme */
      .dark .md-editor {
        --text-color: #e5e7eb;
        --bg-color: #1f2937;
        --border-color: #374151;
        --toolbar-bg: #111827;
        --toolbar-border: #374151;
      }

      .dark .md-editor .editor-container {
        border-color: var(--border-color) !important;
      }

      .dark .md-editor .editor-toolbar {
        background-color: var(--toolbar-bg) !important;
        border-color: var(--toolbar-border) !important;
      }

      .dark .md-editor .editor-toolbar button {
        color: var(--text-color) !important;
      }

      .dark .md-editor .editor-content {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
      }

      .dark .md-editor .editor-content textarea {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
      }

      .dark .md-editor .editor-preview {
        background-color: var(--bg-color) !important;
        color: var(--text-color) !important;
      }

      .dark .md-editor .editor-preview pre {
        background-color: #111827 !important;
        color: var(--text-color) !important;
      }

      .dark .md-editor .editor-preview code {
        background-color: #374151 !important;
        color: var(--text-color) !important;
      }

      .dark .md-editor .editor-preview blockquote {
        border-left: 4px solid #374151 !important;
        color: var(--text-color) !important;
      }
    `;

    document.head.appendChild(style);
  }, []);

  // Issue templates
  const templates = {
    default: `## Description

## Steps to Reproduce

1. 
2. 
3. 

## Expected Behavior

## Actual Behavior

## KiCad Version
- Version: 
- Build: 

## Additional Information
`,
    bug: `## Description

## Steps to Reproduce

1. 
2. 
3. 

## Expected Behavior

## Actual Behavior

## KiCad Version
- Version: 
- Build: 

## Additional Information
`,
    feature: `## Description

## Proposal

## Use Case

## KiCad Version
- Version: 
- Build: 

## Additional Information
`
  };

  // Load template or pre-filled description on component mount
  useEffect(() => {
    if (issueDescription) {
      setDescription(issueDescription);
    } else if (issuableTemplate && templates[issuableTemplate as keyof typeof templates]) {
      setSelectedTemplate(issuableTemplate);
      setDescription(templates[issuableTemplate as keyof typeof templates]);
    } else {
      setDescription(templates.default);
    }
  }, [issueDescription, issuableTemplate]);

  // Handle template change
  const handleTemplateChange = (template: string) => {
    setSelectedTemplate(template);
    setDescription(templates[template as keyof typeof templates]);
  };

  // Handle markdown editor change
  const handleEditorChange = ({ text }: { text: string }) => {
    setDescription(text);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      setError(t('issue_new.error_required', '标题和描述不能为空'));
      return;
    }

    setIsSubmitting(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch(`/api/issues`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ title, description, labels }),
      });

      if (response.ok) {
        const data = await response.json();
        setSuccess(t('issue_new.success', '问题创建成功！'));
        // Redirect to the new issue page after a short delay
        setTimeout(() => {
          router.push(`/${lang}/issues/${data.gitlab_iid}`);
        }, 1500);
      } else {
        const errorData = await response.json();
        setError(errorData.error || t('issue_new.error', '创建问题失败'));
      }
    } catch (error) {
      console.error('Error creating issue:', error);
      setError(t('issue_new.error', '创建问题失败'));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-2xl font-bold mb-6 text-card-foreground">{t('issue_new.title', '新建问题')}</h1>

      {error && (
        <div className="mb-4 p-4 bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 rounded-lg">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-4 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-lg">
          {success}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-card-foreground mb-2">
            {t('issue_new.issue_title', '标题')}
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder={t('issue_new.placeholder_title', '请输入问题标题')}
          />
        </div>

        <div>
          <label htmlFor="template" className="block text-sm font-medium text-card-foreground mb-2">
            {t('issue_new.template', 'Template')}
          </label>
          <select
            id="template"
            value={selectedTemplate}
            onChange={(e) => handleTemplateChange(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
          >
            <option value="default">{t('issue_new.template_default', 'Default')}</option>
            <option value="bug">{t('issue_new.template_bug', 'Bug Report')}</option>
            <option value="feature">{t('issue_new.template_feature', 'Feature Request')}</option>
          </select>
        </div>

        <div>
          <label htmlFor="labels" className="block text-sm font-medium text-card-foreground mb-2">
            {t('issue_new.labels', '标签')}
          </label>
          <input
            type="text"
            id="labels"
            value={labels}
            onChange={(e) => setLabels(e.target.value)}
            className="w-full px-4 py-3 border border-border rounded-lg bg-card text-card-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all"
            placeholder={t('issue_new.labels_placeholder', 'bug, feature, etc')}
          />
          <p className="mt-1 text-xs text-muted-foreground">{t('issue_new.labels_hint', 'Separate multiple labels with commas')}</p>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-card-foreground mb-2">
            {t('issue_new.issue_description', '描述')}
          </label>
          <Editor
            value={description}
            onChange={handleEditorChange}
            renderHTML={renderHTML}
            placeholder={t('issue_new.placeholder_description', '请详细描述问题，包括复现步骤、预期结果和实际结果')}
            style={{ height: '500px' }}
          />
          <p className="mt-1 text-xs text-muted-foreground">{t('issue_new.markdown_supported', 'Markdown is supported')}</p>
        </div>

        <div className="space-y-4">
          <h3 className="text-sm font-medium text-card-foreground">{t('issue_new.tips', 'Tips')}</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li>{t('issue_new.tip_1', 'Report only one issue')}</li>
            <li>{t('issue_new.tip_2', 'Search first to ensure the issue hasn\'t been reported')}</li>
            <li>{t('issue_new.tip_3', 'Only provide necessary information to fix the issue')}</li>
            <li>{t('issue_new.tip_4', 'If using a stable version, ensure it\'s the latest')}</li>
            <li>{t('issue_new.tip_5', '📸 For visual issues, attach screenshots; for complex steps, attach videos')}</li>
            <li>{t('issue_new.tip_6', '🔢 In the KiCad Version section, paste version information (Help → About KiCad → Copy Version Information)')}</li>
          </ul>
        </div>

        <div className="flex items-center justify-between">
          <button
            type="submit"
            disabled={isSubmitting}
            className="px-6 py-3 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {isSubmitting ? t('issue_new.creating', '提交中...') : t('issue_new.create_issue', '提交')}
          </button>
        </div>
      </form>
    </div>
  );
}
