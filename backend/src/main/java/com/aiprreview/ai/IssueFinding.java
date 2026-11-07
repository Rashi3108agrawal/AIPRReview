package com.aiprreview.ai;

import com.aiprreview.model.ReviewIssue;

public record IssueFinding(
        ReviewIssue.IssueType type,
        ReviewIssue.IssueSeverity severity,
        String filePath,
        Integer lineNumber,
        String title,
        String description,
        String suggestion) {
}
