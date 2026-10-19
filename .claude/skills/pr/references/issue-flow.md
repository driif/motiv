# Issue Comment Flow

No worktree, diff or architecture analysis — understand the issue and draft a helpful comment.

1. Fetch issue and discussion:
   ```bash
   gh issue view <number> --json title,body,author,state,labels,comments,createdAt
   ```
2. Read the full discussion: what was reported, what others said, linked PRs.
3. If the issue references code, files or behavior, find and read them.
4. Draft a comment: root-cause analysis, a proposed approach, clarifying questions, or
   acknowledgment with next steps.
5. Display the draft, then ask:
   ```
   question: "Post this comment to issue #<number>?"
   header: "Comment"
   options:
     - Post (post as shown above)
     - Edit (tell me what to change)
     - Cancel (discard draft)
   ```
6. On Post — a regular comment, not a review:
   ```bash
   cat > /tmp/issue-comment.md << 'COMMENT_END'
   <comment content>
   COMMENT_END
   gh issue comment <number> --body-file /tmp/issue-comment.md
   ```
